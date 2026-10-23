package com.luizgasparetto.backend.monolito.auth

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseCookie
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.net.URI
import java.time.Duration

data class RegisterInput(val name: String = "", val email: String = "", val password: String = "", val locale: String? = null)
data class LoginInput(val email: String = "", val password: String = "")
data class GoogleInput(val credential: String = "", val locale: String? = null)
data class EmailInput(val email: String = "")
data class TokenInput(val token: String = "")
data class ResetPasswordInput(val token: String = "", val newPassword: String = "")
data class ChangePasswordInput(val currentPassword: String = "", val newPassword: String = "")
data class ChangeEmailInput(val newEmail: String = "")
data class LocaleInput(val locale: String = "pt")

@RestController
@RequestMapping("/api/v1/auth")
class MyceliumAuthController(
    private val auth: MyceliumAuthService,
    private val rateLimiter: AuthRateLimiter,
    @Value("\${MYCELIUM_FRONTEND_URL:http://localhost:3000}") private val frontendUrl: String,
) {
    @PostMapping("/register")
    fun register(@RequestBody input: RegisterInput, request: HttpServletRequest): Map<String, Any> {
        checkOrigin(request)
        rateLimiter.check("register-ip", request.remoteAddr, 10, 1440)
        rateLimiter.check("register-email", input.email, 3, 1440)
        val profile = auth.register(input.name, input.email, input.password, input.locale ?: request.getHeader("Accept-Language"))
        return mapOf("user" to profile, "message" to "Check your email to confirm your account")
    }

    @PostMapping("/confirm-email")
    fun confirmEmail(@RequestBody input: TokenInput, request: HttpServletRequest): Map<String, String> {
        checkOrigin(request)
        auth.confirmEmail(input.token)
        return mapOf("message" to "Email confirmed")
    }

    @PostMapping("/confirm/resend")
    fun resend(@RequestBody input: EmailInput, request: HttpServletRequest): Map<String, String> {
        checkOrigin(request)
        rateLimiter.check("resend-email", input.email, 3, 60)
        auth.resendConfirmation(input.email)
        return genericMessage()
    }

    @PostMapping("/login")
    fun login(@RequestBody input: LoginInput, request: HttpServletRequest, response: HttpServletResponse): AuthProfile {
        checkOrigin(request)
        rateLimiter.check("login-email", input.email, 10, 15)
        rateLimiter.check("login-ip", request.remoteAddr, 100, 15)
        val (profile, token) = auth.login(input.email, input.password)
        setSession(response, request, token)
        return profile
    }

    @PostMapping("/google")
    fun google(@RequestBody input: GoogleInput, request: HttpServletRequest, response: HttpServletResponse): AuthProfile {
        checkOrigin(request)
        rateLimiter.check("google-ip", request.remoteAddr, 50, 15)
        val (profile, token) = auth.loginWithGoogle(input.credential, input.locale ?: request.getHeader("Accept-Language"))
        setSession(response, request, token)
        return profile
    }

    @GetMapping("/me")
    fun me(request: HttpServletRequest): AuthProfile = auth.profile(requireUser(request))

    @PostMapping("/logout")
    fun logout(request: HttpServletRequest, response: HttpServletResponse): Map<String, String> {
        checkOrigin(request)
        auth.logout(sessionToken(request))
        response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie("", request, Duration.ZERO).toString())
        return mapOf("message" to "Signed out")
    }

    @PostMapping("/forgot-password")
    fun forgot(@RequestBody input: EmailInput, request: HttpServletRequest): Map<String, String> {
        checkOrigin(request)
        rateLimiter.check("forgot-email", input.email, 3, 60)
        rateLimiter.check("forgot-ip", request.remoteAddr, 20, 60)
        auth.forgotPassword(input.email)
        return genericMessage()
    }

    @PostMapping("/reset-password")
    fun reset(@RequestBody input: ResetPasswordInput, request: HttpServletRequest): Map<String, String> {
        checkOrigin(request)
        rateLimiter.check("reset-ip", request.remoteAddr, 20, 60)
        auth.resetPassword(input.token, input.newPassword)
        return mapOf("message" to "Password changed")
    }

    @PostMapping("/change-password")
    fun changePassword(@RequestBody input: ChangePasswordInput, request: HttpServletRequest, response: HttpServletResponse): Map<String, String> {
        checkOrigin(request)
        val user = requireUser(request)
        rateLimiter.check("change-password", user.id.toString(), 10, 60)
        auth.changePassword(user, input.currentPassword, input.newPassword)
        response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie("", request, Duration.ZERO).toString())
        return mapOf("message" to "Password changed. Sign in again")
    }

    @PostMapping("/change-email/request")
    fun changeEmail(@RequestBody input: ChangeEmailInput, request: HttpServletRequest): Map<String, String> {
        checkOrigin(request)
        val user = requireUser(request)
        rateLimiter.check("change-email", user.id.toString(), 5, 1440)
        auth.requestEmailChange(user, input.newEmail)
        return genericMessage()
    }

    @PostMapping("/change-email/confirm")
    fun confirmEmailChange(@RequestBody input: TokenInput, request: HttpServletRequest): Map<String, String> {
        checkOrigin(request)
        auth.confirmEmailChange(input.token)
        return mapOf("message" to "Email changed. Sign in again")
    }

    @PostMapping("/locale")
    fun locale(@RequestBody input: LocaleInput, request: HttpServletRequest): AuthProfile {
        checkOrigin(request)
        return auth.updateLocale(requireUser(request), input.locale)
    }

    private fun requireUser(request: HttpServletRequest): AuthUser = auth.findBySession(sessionToken(request))
        ?: throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sign in required")

    private fun sessionToken(request: HttpServletRequest): String? = request.cookies?.firstOrNull { it.name == "myc_session" }?.value

    private fun setSession(response: HttpServletResponse, request: HttpServletRequest, token: String) {
        response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie(token, request, Duration.ofDays(7)).toString())
    }

    private fun sessionCookie(token: String, request: HttpServletRequest, age: Duration): ResponseCookie =
        ResponseCookie.from("myc_session", token).httpOnly(true)
            .secure(request.isSecure || frontendUrl.startsWith("https://", ignoreCase = true))
            .sameSite("Lax").path("/").maxAge(age).build()

    private fun genericMessage() = mapOf("message" to "If the account exists, an email will be sent")

    private fun checkOrigin(request: HttpServletRequest) {
        val origin = request.getHeader("Origin") ?: return
        val expected = try { URI(frontendUrl).let { it.scheme + "://" + it.authority } } catch (_: Exception) { "" }
        if (origin != expected) throw ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid origin")
    }
}
