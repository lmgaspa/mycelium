package com.luizgasparetto.backend.dto.card

data class CardCartItemDto(
    val id: String,
    val title: String,
    val price: Double,
    val quantity: Int,
    val imageUrl: String
)