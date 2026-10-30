// src/main/kotlin/com/luizgasparetto/backend/controllers/pix/PixEfiWebhookController.kt
package com.luizgasparetto.backend.controllers.pix

import com.fasterxml.jackson.databind.ObjectMapper
import com.luizgasparetto.backend.models.order.OrderStatus
import com.luizgasparetto.backend.models.webhook.WebhookEvent
import com.luizgasparetto.backend.payments.web.PaymentTriggerService
import com.luizgasparetto.backend.repositories.OrderRepository
import com.luizgasparetto.backend.repositories.WebhookEventRepository
import com.luizgasparetto.backend.services.email.pix.PixEmailService
import com.luizgasparetto.backend.services.order.OrderEventsPublisher
import com.luizgasparetto.backend.payments.web.EfiPixSendWebhookController
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import com.luizgasparetto.backend.web.ApiRoutes
import org.springframework.web.bind.annotation.RestController
import java.time.OffsetDateTime

@RestController
@RequestMapping("${ApiRoutes.API_V1}/webhooks/payment")
class PixEfiWebhookController(
    private val orderRepository: OrderRepository,
    private val emailService: PixEmailService,
    private val mapper: ObjectMapper,
    private val events: OrderEventsPublisher,
    private val webhookRepo: WebhookEventRepository,
    // 🔌 Injeção do orquestrador de repasse (mantém OCP: controller só orquestra, regra fica no serviço)
    private val payoutTrigger: PaymentTriggerService,
    private val payoutWebhook: EfiPixSendWebhookController
) {
    private val log = LoggerFactory.getLogger(PixEfiWebhookController::class.java)

    @PostMapping("/pix", consumes = ["application/json"])
    @Transactional
    fun handle(@RequestBody rawBody: String): ResponseEntity<String> {
        log.info("EFI WEBHOOK RAW={}", rawBody.take(5000))

        val root = runCatching { mapper.readTree(rawBody) }.getOrElse {
            log.warn("EFI WEBHOOK: JSON inválido: {}", it.message)
            webhookRepo.save(
                WebhookEvent(
                    txid = null,
                    status = "INVALID_JSON",
                    chargeId = null,
                    provider = "PIX",
                    rawBody = rawBody,
                    receivedAt = OffsetDateTime.now()
                )
            )
            return ResponseEntity.ok("⚠️ Ignorado: JSON inválido")
        }

        val pix0 = root.path("pix").takeIf { it.isArray && it.size() > 0 }?.get(0)
        
        // Detecta se é webhook de repasse (tem idEnvio mas não tem txid)
        // idEnvio pode estar na raiz, em pix[0], ou em pix[0].gnExtras.idEnvio
        val idEnvio = when {
            !root.path("idEnvio").isMissingNode -> root.path("idEnvio").asText()
            pix0 != null && !pix0.path("idEnvio").isMissingNode -> pix0.path("idEnvio").asText()
            pix0 != null && !pix0.path("gnExtras").isMissingNode && !pix0.path("gnExtras").path("idEnvio").isMissingNode -> 
                pix0.path("gnExtras").path("idEnvio").asText()
            else -> null
        }?.takeIf { it.isNotBlank() }
        
        val txid = when {
            !root.path("txid").isMissingNode -> root.path("txid").asText()
            pix0 != null && !pix0.path("txid").isMissingNode -> pix0.path("txid").asText()
            else -> null
        }?.takeIf { it.isNotBlank() }

        val status = when {
            !root.path("status").isMissingNode -> root.path("status").asText()
            pix0 != null && !pix0.path("status").isMissingNode -> pix0.path("status").asText()
            else -> null
        }

        // Se tem idEnvio mas não tem txid, é webhook de repasse - redireciona
        if (idEnvio != null && txid == null) {
            log.info("EFI WEBHOOK: detectado webhook de REPASSE (idEnvio={}, status={}) - redirecionando", idEnvio, status)
            try {
                // Extrai dados do webhook de repasse
                val payoutStatus = status?.uppercase() ?: pix0?.path("status")?.asText()?.uppercase()
                val endToEndId = when {
                    !root.path("endToEndId").isMissingNode -> root.path("endToEndId").asText()
                    pix0 != null && !pix0.path("endToEndId").isMissingNode -> pix0.path("endToEndId").asText()
                    else -> null
                }
                
                // Constrói payload no formato esperado pelo controller de repasse
                val payload = mutableMapOf<String, Any?>(
                    "idEnvio" to idEnvio,
                    "status" to payoutStatus
                )
                if (endToEndId != null) payload["endToEndId"] = endToEndId
                
                payoutWebhook.onSendWebhook(payload)
                return ResponseEntity.ok("✅ Webhook de repasse processado")
            } catch (e: Exception) {
                log.error("EFI WEBHOOK: falha ao processar webhook de repasse: {}", e.message, e)
                return ResponseEntity.ok("⚠️ Erro ao processar webhook de repasse")
            }
        }

        // Log/auditoria
        webhookRepo.save(
            WebhookEvent(
                txid = txid,
                status = status,
                chargeId = null,
                provider = "PIX",
                rawBody = rawBody,
                receivedAt = OffsetDateTime.now()
            )
        )

        log.info("EFI WEBHOOK PARSED txid={}, status={}", txid, status)
        if (txid == null) return ResponseEntity.ok("⚠️ Ignorado: txid ausente")

        val order = orderRepository.findWithItemsByTxid(txid)
            ?: return ResponseEntity.ok("⚠️ Ignorado: pedido não encontrado para txid=$txid")

        // Inclui variantes acentuadas e confirmadas
        val paidStatuses = setOf(
            "CONCLUIDA","CONCLUÍDA","LIQUIDADO","LIQUIDADA",
            "ATIVA-RECEBIDA","COMPLETED","PAID","CONFIRMADA","CONFIRMADO"
        )
        val shouldMarkPaid = status.isNullOrBlank() || paidStatuses.contains(status.uppercase())
        if (!shouldMarkPaid) return ResponseEntity.ok("ℹ️ Ignorado: status=$status não indica pagamento")
        if (order.paid) return ResponseEntity.ok("ℹ️ Ignorado: pedido já estava pago")

        val now = OffsetDateTime.now()
        val reservaValida = order.status == OrderStatus.WAITING &&
                (order.reserveExpiresAt == null || now.isBefore(order.reserveExpiresAt))

        return if (reservaValida) {
            order.paid = true
            order.paidAt = now
            order.status = OrderStatus.CONFIRMED
            orderRepository.save(order)

            // E-mails da compra (cliente + autor)
            runCatching {
                emailService.sendPixClientEmail(order)
                emailService.sendPixAuthorEmail(order)
            }.onFailure { e ->
                log.error("EFI WEBHOOK: falha ao enviar e-mails do order {}: {}", order.id, e.message, e)
            }

            // 🔥 REPASSE IMEDIATO (PIX é T+0): delega cálculo, mínimo e política ao serviço
            runCatching {
                payoutTrigger.tryTriggerByRef(
                    orderRef = order.id?.toString(),
                    externalId = txid,
                    sourceProvider = "PIX-WEBHOOK"
                )
            }.onFailure { e ->
                log.error("EFI WEBHOOK: payout trigger falhou (orderId={}, txid={}): {}", order.id, txid, e.message)
            }

            order.id?.let { runCatching { events.publishPaid(it) } }
            ResponseEntity.ok("✅ Pago; reserva válida; pedido CONFIRMED; e-mails enviados; repasse disparado")
        } else {
            order.status = OrderStatus.REFUNDED
            orderRepository.save(order)
            log.warn("Pagamento recebido após expiração da reserva. txid={}, orderId={}", txid, order.id)
            ResponseEntity.ok("⚠️ Pago após expiração; pedido cancelado/estorno")
        }
    }
}
