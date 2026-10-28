package com.luizgasparetto.backend.monolito.web

import com.luizgasparetto.backend.monolito.auth.AuthRateLimiter
import com.luizgasparetto.backend.monolito.auth.MyceliumAuthController
import com.luizgasparetto.backend.monolito.auth.MyceliumAuthService
import com.luizgasparetto.backend.monolito.exceptions.ReservationConflictException
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

class ApiExceptionHandlerHttpTest {
    private val advice = ApiExceptionHandler()

    @Test
    fun `me without a session returns 401`() {
        val controller = MyceliumAuthController(
            mock(MyceliumAuthService::class.java),
            mock(AuthRateLimiter::class.java),
            "http://localhost:3000"
        )
        val mvc = MockMvcBuilders.standaloneSetup(controller).setControllerAdvice(advice).build()

        mvc.perform(get("/api/v1/auth/me"))
            .andExpect(status().isUnauthorized)
            .andExpect(jsonPath("$.code").value("HTTP_401"))
    }

    @Test
    fun `invalid argument and stock conflict have distinct responses`() {
        val invalid = advice.handleIllegalArg(IllegalArgumentException("Invalid amount"))
        val stock = advice.handleReservationConflict(ReservationConflictException("book-1"))

        kotlin.test.assertEquals(400, invalid.statusCode.value())
        kotlin.test.assertEquals("INVALID_ARGUMENT", invalid.body?.code)
        kotlin.test.assertEquals(409, stock.statusCode.value())
        kotlin.test.assertEquals("OUT_OF_STOCK", stock.body?.code)
    }

    @Test
    fun `unexpected SSE failure returns 500`() {
        val mvc = MockMvcBuilders.standaloneSetup(FailingEventsController())
            .setControllerAdvice(advice).build()

        mvc.perform(get("/test/events").accept(MediaType.TEXT_EVENT_STREAM))
            .andExpect(status().isInternalServerError)
    }

    @RestController
    private class FailingEventsController {
        @GetMapping("/test/events", produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
        fun events(): String = throw IllegalStateException("Unexpected SSE failure")
    }
}
