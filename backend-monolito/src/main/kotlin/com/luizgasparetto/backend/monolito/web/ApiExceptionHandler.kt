package com.luizgasparetto.backend.monolito.web

import com.luizgasparetto.backend.monolito.exceptions.ReservationConflictException
import com.luizgasparetto.backend.monolito.exceptions.PaymentGatewayException
import jakarta.servlet.http.HttpServletRequest
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.resource.NoResourceFoundException
import org.springframework.web.server.ResponseStatusException

@RestControllerAdvice
class ApiExceptionHandler {
    private val log = LoggerFactory.getLogger(ApiExceptionHandler::class.java)

    data class ApiError(
        val code: String,
        val message: String
    )

    @ExceptionHandler(NoResourceFoundException::class)
    fun handleNoResource(ex: NoResourceFoundException, request: HttpServletRequest): ResponseEntity<Void> {
        return ResponseEntity.notFound().build()
    }

    @ExceptionHandler(ReservationConflictException::class)
    fun handleReservationConflict(ex: ReservationConflictException): ResponseEntity<ApiError> {
        log.info("Reserva em conflito para bookId={}: {}", ex.bookId, ex.message)
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(ApiError(code = "OUT_OF_STOCK", message = ex.message ?: "Indisponível"))
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArg(ex: IllegalArgumentException): ResponseEntity<ApiError> {
        log.info("Argumento inválido: {}", ex.message)
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiError(code = "INVALID_ARGUMENT", message = ex.message ?: "Requisição inválida"))
    }

    /**
     * Falha ao comunicar com gateway de pagamento (Efí).
     * Ex.: 401 sandbox, timeout, 5xx, etc.
     */
    @ExceptionHandler(PaymentGatewayException::class)
    fun handlePaymentGateway(ex: PaymentGatewayException): ResponseEntity<ApiError> {
        log.warn(
            "Erro ao comunicar com gateway de pagamento: {} (gatewayCode={})",
            ex.message,
            ex.gatewayCode
        )
        return ResponseEntity
            .status(HttpStatus.BAD_GATEWAY) // 502 – erro em serviço externo
            .body(
                ApiError(
                    code = "PAYMENT_GATEWAY_ERROR",
                    message = ex.message
                )
            )
    }

    // Cliente encerrou a conexão / stream (SSE). Não tentar escrever body.
    @ExceptionHandler(
        org.springframework.web.context.request.async.AsyncRequestNotUsableException::class,
        org.apache.catalina.connector.ClientAbortException::class
    )
    fun handleClientGone(@Suppress("UNUSED_PARAMETER") ex: Exception): ResponseEntity<Void> {
        log.info("Stream/cliente desconectado (SSE). Encerrando sem body.")
        return ResponseEntity.noContent().build()
    }

    @ExceptionHandler(ResponseStatusException::class)
    fun handleResponseStatus(ex: ResponseStatusException): ResponseEntity<ApiError> =
        ResponseEntity.status(ex.statusCode)
            .body(ApiError(code = "HTTP_${ex.statusCode.value()}", message = ex.reason ?: "Request failed"))

    @ExceptionHandler(Exception::class)
    fun handleGeneric(ex: Exception, request: HttpServletRequest): ResponseEntity<Any> {
        log.error("Erro não tratado", ex)
        val accept = (request.getHeader("Accept") ?: "").lowercase()
        if (accept.contains("text/event-stream")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiError(code = "INTERNAL_ERROR", message = "Erro ao processar o checkout. Tente novamente."))
    }
}
