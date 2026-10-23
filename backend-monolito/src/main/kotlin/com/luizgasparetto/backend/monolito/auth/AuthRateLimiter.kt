package com.luizgasparetto.backend.monolito.auth

import org.springframework.http.HttpStatus
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.security.MessageDigest

@Service
class AuthRateLimiter(private val jdbc: JdbcTemplate) {
    fun check(action: String, identifier: String, limit: Int, windowMinutes: Int) {
        val key = MessageDigest.getInstance("SHA-256")
            .digest("$action:${identifier.trim().lowercase()}".toByteArray())
            .joinToString("") { "%02x".format(it) }
        val attempts = jdbc.queryForObject(
            """INSERT INTO auth_rate_limits(key_hash, attempts, expires_at)
               VALUES (?, 1, now() + (? * interval '1 minute'))
               ON CONFLICT (key_hash) DO UPDATE SET
                 attempts = CASE WHEN auth_rate_limits.expires_at < now() THEN 1 ELSE auth_rate_limits.attempts + 1 END,
                 expires_at = CASE WHEN auth_rate_limits.expires_at < now() THEN now() + (? * interval '1 minute') ELSE auth_rate_limits.expires_at END
               RETURNING attempts""",
            Int::class.java, key, windowMinutes, windowMinutes
        ) ?: 0
        if (attempts > limit) throw ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many requests")
    }
}
