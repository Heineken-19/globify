package com.globify.controller;

import com.globify.dto.BlogPostRequestDTO;
import com.globify.dto.BlogPostResponseDTO;
import com.globify.service.BlogPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogposts")
@RequiredArgsConstructor
public class BlogPostController {

    private final BlogPostService blogPostService;

    @GetMapping
    public ResponseEntity<List<BlogPostResponseDTO>> getAllBlogPosts() {
        List<BlogPostResponseDTO> blogPosts = blogPostService.getAllBlogPosts();
        return ResponseEntity.ok(blogPosts);
    }


    @GetMapping("/slug/{slug}")
    public ResponseEntity<BlogPostResponseDTO> getBlogPostBySlug(@PathVariable String slug) {
        BlogPostResponseDTO post = blogPostService.getBlogPostBySlug(slug);
        return ResponseEntity.ok(post);
    }


    @PostMapping
    public ResponseEntity<BlogPostResponseDTO> createBlogPost(@RequestBody BlogPostRequestDTO requestDTO) {
        BlogPostResponseDTO createdPost = blogPostService.createBlogPost(requestDTO);
        return ResponseEntity.ok(createdPost);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPostResponseDTO> updateBlogPostById(
            @PathVariable Long id,
            @RequestBody BlogPostRequestDTO requestDTO) {
        BlogPostResponseDTO updatedPost = blogPostService.updateBlogPostById(id, requestDTO);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlogPostById(@PathVariable Long id) {
        blogPostService.deleteBlogPostById(id);
        return ResponseEntity.noContent().build();
    }
}
