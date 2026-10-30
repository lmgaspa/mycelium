package com.luizgasparetto.backend.dto.pix

data class PixCobrancaResponse(
    val pixCopiaECola: String,
    val imagemQrcodeBase64: String,
    val txid: String
)