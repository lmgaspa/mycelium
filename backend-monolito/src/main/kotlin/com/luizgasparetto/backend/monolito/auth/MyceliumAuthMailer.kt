package com.luizgasparetto.backend.monolito.auth

import jakarta.mail.internet.InternetAddress
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

@Service
class MyceliumAuthMailer(
    private val sender: JavaMailSender,
    @Value("\${MYCELIUM_AUTH_FROM:\${email.author}}") private val from: String,
    @Value("\${MYCELIUM_FRONTEND_URL:http://localhost:3000}") private val frontendUrl: String,
) {
    private data class Copy(val subject: String, val heading: String, val body: String, val button: String)

    fun sendAction(to: String, name: String, locale: String, purpose: String, token: String, minutes: Long) {
        val copy = when (purpose) {
            "confirm-email" -> when (locale) {
                "en" -> Copy("Confirm your Mycelium email", "Confirm your email", "Finish creating your account. This link expires in $minutes minutes.", "Confirm email")
                "es" -> Copy("Confirma tu correo de Mycelium", "Confirma tu correo", "Completa el registro de tu cuenta. Este enlace vence en $minutes minutos.", "Confirmar correo")
                else -> Copy("Confirme seu e-mail Mycelium", "Confirme seu e-mail", "Conclua a criação da sua conta. Este link expira em $minutes minutos.", "Confirmar e-mail")
            }
            "reset-password" -> when (locale) {
                "en" -> Copy("Reset your Mycelium password", "Reset your password", "We received a password reset request. This link expires in $minutes minutes.", "Reset password")
                "es" -> Copy("Restablece tu contraseña de Mycelium", "Restablece tu contraseña", "Recibimos una solicitud para restablecer tu contraseña. Este enlace vence en $minutes minutos.", "Restablecer contraseña")
                else -> Copy("Redefina sua senha Mycelium", "Redefina sua senha", "Recebemos um pedido de redefinição de senha. Este link expira em $minutes minutos.", "Redefinir senha")
            }
            "change-email" -> when (locale) {
                "en" -> Copy("Confirm your new Mycelium email", "Confirm your new email", "A change of email was requested for your account. This link expires in $minutes minutes.", "Confirm new email")
                "es" -> Copy("Confirma tu nuevo correo de Mycelium", "Confirma tu nuevo correo", "Se solicitó un cambio de correo en tu cuenta. Este enlace vence en $minutes minutos.", "Confirmar nuevo correo")
                else -> Copy("Confirme seu novo e-mail Mycelium", "Confirme seu novo e-mail", "Foi solicitada uma alteração de e-mail na sua conta. Este link expira em $minutes minutos.", "Confirmar novo e-mail")
            }
            else -> throw IllegalArgumentException("Unknown mail purpose")
        }
        val route = when (purpose) {
            "confirm-email" -> "/verify-email"
            "reset-password" -> "/reset-password"
            else -> "/settings/change-email/confirm"
        }
        val link = frontendUrl.trimEnd('/') + route + "?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8)
        send(to, copy.subject, html(name, copy, link))
    }

    fun sendAlert(to: String, name: String, locale: String) {
        val copy = when (locale) {
            "en" -> Copy("Mycelium security alert", "Email change requested", "A request to change your account email was made. If this was not you, contact support immediately.", "Open Mycelium")
            "es" -> Copy("Alerta de seguridad de Mycelium", "Se solicitó un cambio de correo", "Se solicitó cambiar el correo de tu cuenta. Si no fuiste tú, contacta con soporte inmediatamente.", "Abrir Mycelium")
            else -> Copy("Alerta de segurança Mycelium", "Alteração de e-mail solicitada", "Foi solicitada uma alteração do e-mail da sua conta. Se não foi você, contate o suporte imediatamente.", "Abrir Mycelium")
        }
        send(to, copy.subject, html(name, copy, frontendUrl.trimEnd('/') + "/support"))
    }

    private fun html(name: String, copy: Copy, link: String): String = """
        <!doctype html><html><body style="margin:0;background:#f7f4fa;font-family:Arial,sans-serif;color:#26163a">
        <main style="max-width:560px;margin:40px auto;padding:36px;background:#fff;border-radius:16px">
        <p style="font-size:15px;font-weight:bold;color:#351260">MYCELIUM</p>
        <h1 style="font-size:27px">${escape(copy.heading)}</h1>
        <p>${escape(name)},</p><p>${escape(copy.body)}</p>
        <p style="margin:30px 0"><a href="${escape(link)}" style="background:#351260;color:#fff;padding:14px 22px;border-radius:24px;text-decoration:none;font-weight:bold">${escape(copy.button)}</a></p>
        <p style="font-size:12px;color:#685d72">${escape(link)}</p>
        </main></body></html>
    """.trimIndent()

    private fun send(to: String, subject: String, content: String) {
        val message = sender.createMimeMessage()
        MimeMessageHelper(message, "UTF-8").apply {
            setFrom(InternetAddress(from, "Mycelium"))
            setTo(to)
            setSubject(subject)
            setText(content, true)
        }
        sender.send(message)
    }

    private fun escape(value: String): String = value.replace("&", "&amp;")
        .replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;")
}
