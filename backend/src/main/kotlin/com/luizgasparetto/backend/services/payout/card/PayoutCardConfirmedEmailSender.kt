package com.luizgasparetto.backend.services.payout.card

import com.luizgasparetto.backend.config.payments.EfiCardPayoutProps
import com.luizgasparetto.backend.models.payout.PayoutEmailStatus
import com.luizgasparetto.backend.models.payout.PayoutEmailType
import com.luizgasparetto.backend.repositories.OrderRepository
import com.luizgasparetto.backend.repositories.PayoutEmailRepository
import com.luizgasparetto.backend.services.email.common.EmailFooter
import com.luizgasparetto.backend.services.email.payout.DiscountDetailsHelper
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Component
import java.math.BigDecimal
import java.nio.charset.StandardCharsets

/**
 * Responsável por enviar emails de confirmação de repasse CARD
 */
@Component
class PayoutCardConfirmedEmailSender(
    mailSender: JavaMailSender,
    orderRepository: OrderRepository,
    payoutEmailRepository: PayoutEmailRepository,
    jdbc: NamedParameterJdbcTemplate,
        payoutProps: EfiCardPayoutProps,
    @Value("\${email.author}") authorEmail: String,
    @Value("\${application.brand.name:Mycelium}") brandName: String,
    @Value("\${mail.from:}") configuredFrom: String,
    @Value("\${mail.logo.url:https://www.andescoresoftware.com.br/AndesCore.jpg}") logoUrl: String,
    @Value("\${application.timezone:America/Bahia}") appTz: String,
        @Value("\${efi.payout.favored-key:}") favoredKeyFromConfig: String,
        @Value("\${efi.card.sandbox:false}") sandbox: Boolean,
        @Value("\${mail.host:}") mailHost: String,
        @Value("\${efi.card.payout.real-fee-percent-1x:3.49}") private val efiRealFeePercent1x: Double,
        @Value("\${efi.card.payout.real-fee-percent-2to6x:3.79}") private val efiRealFeePercent2to6x: Double,
        @Value("\${efi.card.payout.real-fee-percent-7to12x:4.39}") private val efiRealFeePercent7to12x: Double
) : PayoutCardEmailBase(
    mailSender, orderRepository, payoutEmailRepository, jdbc, payoutProps,
    authorEmail, brandName, configuredFrom, logoUrl, appTz, favoredKeyFromConfig, sandbox, mailHost
) {

    fun send(
        orderId: Long,
        amount: BigDecimal,
        payeePixKey: String?,
        idEnvio: String,
        note: String? = null,
        to: String = authorEmail
    ) {
        val from = resolveFrom()

        log.info(
            "📧 PAYOUT CARD EMAIL [CONFIRMED]: iniciando envio - orderId={}, to={}, sandbox={}, mailHost={}",
            orderId, to, sandbox, mailHost
        )
        log.debug(
            "📧 PAYOUT CARD EMAIL [CONFIRMED]: config -> from={}, authorEmail={}, mailHost={}, appTz={}, favoredKeyFromConfig={}, logoUrl={}",
            from, authorEmail, mailHost, appTz, favoredKeyFromConfig, logoUrl
        )

        val maskedKey = payeePixKey?.let { mask(it) } ?: "N/A"
        val amountFormatted = String.format("R$ %.2f", amount.toDouble())
        
        // Busca o valor bruto do pedido
        val order = orderRepository.findById(orderId).orElse(null)
        val amountGross = order?.total ?: amount
        
        // Determina a tarifa real da Efí Bank baseada no número de parcelas
        val installments = order?.installments ?: 1
        val efiRealFeePercent = when {
            installments == 1 -> efiRealFeePercent1x
            installments in 2..6 -> efiRealFeePercent2to6x
            else -> efiRealFeePercent7to12x
        }
        val installmentsLabel = if (installments > 1) "${installments}x" else null
        
        // Calcula os detalhes do desconto usando o valor bruto
        val discountDetails = DiscountDetailsHelper.calculateDiscountDetails(amountGross, payoutProps)
        val discountBlock = DiscountDetailsHelper.buildDiscountDetailsBlock(
            details = discountDetails,
            payoutProps = payoutProps,
            efiRealFeePercent = efiRealFeePercent,
            paymentTypeLabel = "Cartão de Crédito",
            installmentsInfo = installmentsLabel
        )

        val htmlContent = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
                    .amount { font-size: 14px; font-weight: bold; color: #28a745; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>💰 Repasse Cartão Confirmado</h1>
                        <p>Pagamento processado com sucesso</p>
                    </div>
                    <div class="content">
                        <div class="info-box">
                            <h3>📋 Detalhes do Repasse</h3>
                            <p><strong>Pedido:</strong> #$orderId</p>
                            <p><strong>Chave PIX:</strong> $maskedKey</p>
                            <p><strong>ID Envio:</strong> $idEnvio</p>
                            ${note?.let { "<p><strong>Observação:</strong> ${escape(it)}</p>" } ?: ""}
                        </div>
                        
                        $discountBlock
                        
                        <div class="info-box">
                            <h3>✅ Status</h3>
                            <p>O repasse foi processado com sucesso e o valor foi transferido para a conta do autor.</p>
                        </div>
                    </div>
                    ${EmailFooter.build()}
                </div>
            </body>
            </html>
        """.trimIndent()

        val success = try {
            val message = mailSender.createMimeMessage()
            val helper = org.springframework.mail.javamail.MimeMessageHelper(message, true, StandardCharsets.UTF_8.name())

            log.debug(
                "📧 PAYOUT CARD EMAIL [CONFIRMED]: preparando MimeMessage - orderId={}, from={}, to={}, subject={}",
                orderId, from, to, "💰 Repasse Cartão Confirmado - Pedido #$orderId"
            )

            helper.setFrom(from, brandName)
            helper.setTo(to)
            helper.setSubject("💰 Repasse Cartão Confirmado - Pedido #$orderId")
            helper.setText(htmlContent, true)

            log.info("📧 PAYOUT CARD EMAIL [CONFIRMED]: tentando enviar - orderId={}, sandbox={}", orderId, sandbox)
            mailSender.send(message)

            log.info(
                "✅ PAYOUT CARD EMAIL [CONFIRMED]: enviado com sucesso -> {} (orderId={}, amount={}, key={}, sandbox={})",
                to, orderId, amountFormatted, maskedKey, sandbox
            )
            true
        } catch (e: Exception) {
            log.error(
                "❌ PAYOUT CARD EMAIL [CONFIRMED]: falha ao enviar (orderId={}, amount={}, sandbox={}, mailHost={}): {}",
                orderId, amount, sandbox, mailHost, e.message, e
            )
            false
        }

        log.debug(
            "📧 PAYOUT CARD EMAIL [CONFIRMED]: resultado do envio - orderId={}, success={}, sandbox={}",
            orderId, success, sandbox
        )

        persistEmail(
            orderId = orderId,
            to = to,
            emailType = PayoutEmailType.REPASSE_CARD,
            status = if (success) PayoutEmailStatus.SENT else PayoutEmailStatus.FAILED,
            errorMessage = if (!success) "Erro ao enviar e-mail de confirmação (exceção capturada)" else null
        )
    }
}

