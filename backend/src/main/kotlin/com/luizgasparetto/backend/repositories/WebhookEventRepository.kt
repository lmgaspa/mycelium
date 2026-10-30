package com.luizgasparetto.backend.repositories

import com.luizgasparetto.backend.models.webhook.WebhookEvent
import org.springframework.data.jpa.repository.JpaRepository

interface WebhookEventRepository : JpaRepository<WebhookEvent, Long>