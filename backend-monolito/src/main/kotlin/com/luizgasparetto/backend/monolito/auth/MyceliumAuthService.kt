package com.luizgasparetto.backend.monolito.auth

import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.dao.DuplicateKeyException
import org.springframework.http.HttpStatus
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.security.MessageDigest
import java.security.SecureRandom
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Base64
import java.util.Locale
import java.util.UUID

data class AuthUser(
    val id: UUID,
    val email: String,
    val displayName: String,
    val passwordHash: String?,
    val googleSubject: String?,
    val emailVerified: Boolean,
    val locale: String,
)

data class AuthProfile(val id: UUID, val email: String, val displayName: String, val locale: String)

@Service
class MyceliumAuthService(
    private val jdbc: JdbcTemplate,
    private val mailer: MyceliumAuthMailer,
    @Value("\${GOOGLE_CLIENT_ID:}") private val googleClientId: String,
) {
    private val passwordEncoder = BCryptPasswordEncoder(12)
    private val random = SecureRandom()
    private val userMapper = RowMapper { rs, _ ->
        AuthUser(
            rs.getObject("id", UUID::class.java),
            rs.getString("email"),
            rs.getString("display_name"),
            rs.getString("password_hash"),
            rs.getString("google_subject"),
            rs.getBoolean("email_verified"),
            rs.getString("locale"),
        )
    }
    private val userColumns = "id, email, display_name, password_hash, google_subject, email_verified, locale"

    fun normalizeLocale(raw: String?): String = when (raw?.lowercase(Locale.ROOT)?.take(2)) {
        "en" -> "en"
        "es" -> "es"
        else -> "pt"
    }

    fun profile(user: AuthUser) = AuthProfile(user.id, user.email, user.displayName, user.locale)

    fun findByEmail(email: String): AuthUser? = jdbc.query(
        "SELECT $userColumns FROM auth_users WHERE lower(email) = lower(?)", userMapper, email.trim()
    ).firstOrNull()

    private fun findByGoogleSubject(subject: String): AuthUser? = jdbc.query(
        "SELECT $userColumns FROM auth_users WHERE google_subject = ?", userMapper, subject
    ).firstOrNull()

    fun findBySession(rawToken: String?): AuthUser? {
        if (rawToken.isNullOrBlank()) return null
        val qualifiedColumns = userColumns.split(", ").joinToString(", ") { "u.$it" }
        return jdbc.query(
            """SELECT $qualifiedColumns FROM auth_users u JOIN auth_sessions s ON s.user_id = u.id
               WHERE s.token_hash = ? AND s.expires_at > now()""", userMapper, hash(rawToken)
        ).firstOrNull()
    }

    @Transactional
    fun register(name: String, email: String, password: String, localeInput: String?): AuthProfile {
        val cleanEmail = validEmail(email)
        val cleanName = name.trim().takeIf { it.length in 2..120 }
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid name")
        validPassword(password)
        if (findByEmail(cleanEmail) != null) throw ResponseStatusException(HttpStatus.CONFLICT, "Email already registered")
        val id = UUID.randomUUID()
        val locale = normalizeLocale(localeInput)
        try {
            jdbc.update(
                "INSERT INTO auth_users(id, email, display_name, password_hash, locale) VALUES (?, ?, ?, ?, ?)",
                id, cleanEmail, cleanName, passwordEncoder.encode(password), locale
            )
        } catch (_: DuplicateKeyException) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "Email already registered")
        }
        val token = actionToken(id, "confirm-email", null, 30)
        mailer.sendAction(cleanEmail, cleanName, locale, "confirm-email", token, 30)
        return AuthProfile(id, cleanEmail, cleanName, locale)
    }

    @Transactional
    fun confirmEmail(token: String) {
        val row = consumeActionToken(token, "confirm-email")
        jdbc.update("UPDATE auth_users SET email_verified = TRUE, updated_at = now() WHERE id = ?", row.first)
    }

    @Transactional
    fun resendConfirmation(email: String) {
        val user = findByEmail(email) ?: return
        if (user.emailVerified) return
        val token = actionToken(user.id, "confirm-email", null, 30)
        mailer.sendAction(user.email, user.displayName, user.locale, "confirm-email", token, 30)
    }

    fun login(email: String, password: String): Pair<AuthProfile, String> {
        val user = findByEmail(email)
        if (user == null || user.passwordHash == null || !passwordEncoder.matches(password, user.passwordHash)) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials")
        }
        if (!user.emailVerified) throw ResponseStatusException(HttpStatus.FORBIDDEN, "Confirm your email first")
        return profile(user) to createSession(user.id)
    }

    @Transactional
    fun loginWithGoogle(credential: String, localeInput: String?): Pair<AuthProfile, String> {
        if (googleClientId.isBlank()) throw ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Google login is not configured")
        val verifier = GoogleIdTokenVerifier.Builder(NetHttpTransport(), GsonFactory.getDefaultInstance())
            .setAudience(listOf(googleClientId))
            .setIssuers(listOf("https://accounts.google.com", "accounts.google.com"))
            .build()
        val payload = try { verifier.verify(credential)?.payload } catch (_: Exception) { null }
            ?: throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google credential")
        if (payload.emailVerified != true) throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google email is not verified")
        val email = validEmail(payload.email)
        val subject = payload.subject ?: throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google credential")
        val linked = findByGoogleSubject(subject)
        val existing = if (linked == null) findByEmail(email) else null
        val user = if (linked != null) {
            linked
        } else if (existing == null) {
            val id = UUID.randomUUID()
            val name = (payload["name"] as? String)?.trim()?.take(120)?.ifBlank { email.substringBefore('@') }
                ?: email.substringBefore('@')
            val locale = normalizeLocale(localeInput)
            jdbc.update(
                """INSERT INTO auth_users(id, email, display_name, google_subject, email_verified, locale)
                   VALUES (?, ?, ?, ?, TRUE, ?)""", id, email, name, subject, locale
            )
            findByEmail(email)!!
        } else {
            if (existing.googleSubject != null && existing.googleSubject != subject) {
                throw ResponseStatusException(HttpStatus.CONFLICT, "Google account mismatch")
            }
            // Linking an existing password account by email alone would permit account takeover.
            if (existing.googleSubject == null) throw ResponseStatusException(HttpStatus.CONFLICT, "Sign in with your password first")
            existing
        }
        return profile(user) to createSession(user.id)
    }

    fun createSession(userId: UUID): String {
        val raw = randomToken()
        jdbc.update(
            "INSERT INTO auth_sessions(token_hash, user_id, expires_at) VALUES (?, ?, ?)",
            hash(raw), userId, java.sql.Timestamp.from(Instant.now().plus(7, ChronoUnit.DAYS))
        )
        return raw
    }

    fun logout(rawToken: String?) {
        if (!rawToken.isNullOrBlank()) jdbc.update("DELETE FROM auth_sessions WHERE token_hash = ?", hash(rawToken))
    }

    @Transactional
    fun forgotPassword(email: String) {
        val user = findByEmail(email) ?: return
        if (user.passwordHash == null) return
        val token = actionToken(user.id, "reset-password", null, 30)
        mailer.sendAction(user.email, user.displayName, user.locale, "reset-password", token, 30)
    }

    @Transactional
    fun resetPassword(token: String, newPassword: String) {
        validPassword(newPassword)
        val (userId, _) = consumeActionToken(token, "reset-password")
        jdbc.update("UPDATE auth_users SET password_hash = ?, updated_at = now() WHERE id = ?", passwordEncoder.encode(newPassword), userId)
        jdbc.update("DELETE FROM auth_sessions WHERE user_id = ?", userId)
    }

    @Transactional
    fun changePassword(user: AuthUser, currentPassword: String, newPassword: String) {
        if (user.passwordHash == null || !passwordEncoder.matches(currentPassword, user.passwordHash)) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect")
        }
        validPassword(newPassword)
        jdbc.update("UPDATE auth_users SET password_hash = ?, updated_at = now() WHERE id = ?", passwordEncoder.encode(newPassword), user.id)
        jdbc.update("DELETE FROM auth_sessions WHERE user_id = ?", user.id)
    }

    @Transactional
    fun requestEmailChange(user: AuthUser, newEmail: String) {
        val cleanEmail = validEmail(newEmail)
        if (findByEmail(cleanEmail) != null) throw ResponseStatusException(HttpStatus.CONFLICT, "Email already registered")
        val token = actionToken(user.id, "change-email", cleanEmail, 30)
        mailer.sendAction(cleanEmail, user.displayName, user.locale, "change-email", token, 30)
        mailer.sendAlert(user.email, user.displayName, user.locale)
    }

    @Transactional
    fun confirmEmailChange(token: String) {
        val (userId, newEmail) = consumeActionToken(token, "change-email")
        val email = newEmail ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token")
        try {
            jdbc.update("UPDATE auth_users SET email = ?, email_verified = TRUE, updated_at = now() WHERE id = ?", email, userId)
        } catch (_: DuplicateKeyException) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "Email already registered")
        }
        jdbc.update("DELETE FROM auth_sessions WHERE user_id = ?", userId)
    }

    fun updateLocale(user: AuthUser, localeInput: String): AuthProfile {
        val locale = normalizeLocale(localeInput)
        jdbc.update("UPDATE auth_users SET locale = ?, updated_at = now() WHERE id = ?", locale, user.id)
        return profile(user.copy(locale = locale))
    }

    private fun actionToken(userId: UUID, purpose: String, newEmail: String?, minutes: Long): String {
        jdbc.update("DELETE FROM auth_action_tokens WHERE user_id = ? AND purpose = ?", userId, purpose)
        val raw = randomToken()
        jdbc.update(
            "INSERT INTO auth_action_tokens(token_hash, user_id, purpose, new_email, expires_at) VALUES (?, ?, ?, ?, ?)",
            hash(raw), userId, purpose, newEmail, java.sql.Timestamp.from(Instant.now().plus(minutes, ChronoUnit.MINUTES))
        )
        return raw
    }

    private fun consumeActionToken(raw: String, purpose: String): Pair<UUID, String?> {
        if (raw.length < 30 || raw.length > 200) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token")
        return jdbc.query(
            """DELETE FROM auth_action_tokens WHERE token_hash = ? AND purpose = ? AND expires_at > now()
               RETURNING user_id, new_email""",
            RowMapper { rs, _ -> rs.getObject("user_id", UUID::class.java) to rs.getString("new_email") },
            hash(raw), purpose
        ).firstOrNull() ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired token")
    }

    private fun validEmail(raw: String): String {
        val email = raw.trim().lowercase(Locale.ROOT)
        if (email.length !in 5..320 || !Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$").matches(email)) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid email")
        }
        return email
    }

    private fun validPassword(password: String) {
        if (password.length !in 12..128) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must contain 12 to 128 characters")
    }

    private fun randomToken(): String = ByteArray(32).also(random::nextBytes).let {
        Base64.getUrlEncoder().withoutPadding().encodeToString(it)
    }

    private fun hash(raw: String): String = MessageDigest.getInstance("SHA-256")
        .digest(raw.toByteArray(Charsets.UTF_8)).joinToString("") { "%02x".format(it) }
}
