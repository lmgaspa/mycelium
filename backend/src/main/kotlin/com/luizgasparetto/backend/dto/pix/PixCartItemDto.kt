package com.luizgasparetto.backend.dto.pix

data class PixCartItemDto(
    val id: String,
    val title: String,
    val price: Double,
    val quantity: Int,
    val imageUrl: String
)