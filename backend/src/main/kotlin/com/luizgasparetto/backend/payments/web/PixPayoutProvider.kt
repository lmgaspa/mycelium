// src/main/kotlin/com/luizgasparetto/backend/payments/web/PixPayoutProvider.kt
package com.luizgasparetto.backend.payments.web

import java.math.BigDecimal

interface PixPayoutProvider {
    fun sendPixPayout(orderId: Long, amount: BigDecimal, favoredPixKey: String): String
}
