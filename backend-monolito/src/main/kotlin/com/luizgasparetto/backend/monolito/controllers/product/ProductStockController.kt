package com.luizgasparetto.backend.monolito.controllers.product

import com.luizgasparetto.backend.monolito.web.ApiRoutes
import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

data class ProductStockResponse(val slug: String, val stock: Int)

@RestController
@RequestMapping("${ApiRoutes.API_V1}/products")
class ProductStockController(private val jdbc: JdbcTemplate) {
    @GetMapping("/{slug}/stock")
    fun getStock(@PathVariable slug: String): ResponseEntity<ProductStockResponse> {
        val stock = jdbc.query(
            "SELECT stock FROM mycelium_product_stock WHERE slug = ?",
            { result, _ -> result.getInt("stock") },
            slug,
        ).firstOrNull() ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(ProductStockResponse(slug, stock))
    }
}
