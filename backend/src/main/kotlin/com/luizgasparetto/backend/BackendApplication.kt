package com.luizgasparetto.backend

import com.luizgasparetto.backend.config.coupon.CouponProperties
import com.luizgasparetto.backend.config.coupon.CouponLancamentoProperties
import com.luizgasparetto.backend.config.efi.CardEfiProperties
import com.luizgasparetto.backend.config.efi.PixEfiProperties
import com.luizgasparetto.backend.config.payments.EfiPixPayoutProps
import com.luizgasparetto.backend.config.payments.EfiCardPayoutProps
import com.luizgasparetto.backend.privacy.PrivacyProps
import com.luizgasparetto.backend.bootstrap.BootstrapAuthorProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableScheduling
@EnableConfigurationProperties(PrivacyProps::class, PixEfiProperties::class, CardEfiProperties::class, EfiPixPayoutProps::class, EfiCardPayoutProps::class, BootstrapAuthorProperties::class, CouponProperties::class, CouponLancamentoProperties::class)
class BackendApplication

fun main(args: Array<String>) {
	runApplication<BackendApplication>(*args)
}
