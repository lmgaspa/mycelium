package com.luizgasparetto.backend.authors

import com.luizgasparetto.backend.models.author.Author
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface AuthorRepository : JpaRepository<Author, Long> {
    fun findByEmailIgnoreCase(email: String): Optional<Author>
    fun existsByEmailIgnoreCase(email: String): Boolean
}