package com.luizgasparetto.backend.monolito.auth

import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class AuthCleanupJob(private val jdbc: JdbcTemplate) {
    @Scheduled(cron = "0 15 3 * * *", zone = "UTC")
    fun removeExpired() {
        jdbc.update("DELETE FROM auth_sessions WHERE expires_at < now()")
        jdbc.update("DELETE FROM auth_action_tokens WHERE expires_at < now()")
        jdbc.update("DELETE FROM auth_rate_limits WHERE expires_at < now()")
    }
}
