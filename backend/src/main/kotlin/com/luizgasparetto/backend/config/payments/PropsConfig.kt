// src/main/kotlin/com/luizgasparetto/backend/config/PropsConfig.kt
package com.luizgasparetto.backend.config.payments

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(EfiPixPayoutProps::class, EfiCardPayoutProps::class)
class PropsConfig
