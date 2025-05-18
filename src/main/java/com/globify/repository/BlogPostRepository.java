package com.globify.repository;

import com.globify.entity.BlogPost;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    Optional<BlogPost> findBySlug(String slug);
    void deleteBySlug(String slug);

    @Query("SELECT b FROM BlogPost b WHERE " +
            "LOWER(b.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(CAST(b.content AS string)) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<BlogPost> searchBlogs(@Param("searchTerm") String searchTerm, Pageable pageable);
}