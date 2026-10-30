package com.luizgasparetto.backend.controllers.book

import com.luizgasparetto.backend.dto.book.BookDTO
import com.luizgasparetto.backend.services.book.BookService
import com.luizgasparetto.backend.web.ApiRoutes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${ApiRoutes.API_V1}/books")
class BookController(
    private val bookService: BookService
) {
    @GetMapping
    fun listBooks(): ResponseEntity<List<BookDTO>> =
        ResponseEntity.ok(bookService.getAllBooks())

    @GetMapping("/{slug}")
    fun getBook(@PathVariable slug: String): ResponseEntity<BookDTO> =
        ResponseEntity.ok(bookService.getBookDtoById(slug))
}
