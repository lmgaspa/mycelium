package com.luizgasparetto.backend.monolito.auth

import jakarta.mail.Session
import jakarta.mail.internet.MimeMessage
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.Mockito.mock
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.springframework.mail.javamail.JavaMailSender
import java.util.Properties

class MyceliumAuthMailerTest {
    @Test
    fun `confirmation email follows selected Spanish locale and frontend link`() {
        val sender = mock(JavaMailSender::class.java)
        `when`(sender.createMimeMessage()).thenReturn(MimeMessage(Session.getInstance(Properties())))
        val mailer = MyceliumAuthMailer(sender, "auth@mycelium.example", "https://mycelium.example")

        mailer.sendAction("cliente@example.com", "Ana", "es", "confirm-email", "sample-token", 30)

        val capture = ArgumentCaptor.forClass(MimeMessage::class.java)
        verify(sender).send(capture.capture())
        val message = capture.value
        assertTrue(message.subject.contains("Confirma tu correo"))
        assertTrue(message.content.toString().contains("/verify-email?token=sample-token"))
    }
}
