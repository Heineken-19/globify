package com.globify.controller;

import com.globify.dto.BlogPostRequestDTO;
import com.globify.dto.BlogPostResponseDTO;
import com.globify.exception.ResourceNotFoundException;
import com.globify.service.BlogPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
        try {
            BlogPostResponseDTO post = blogPostService.getBlogPostBySlug(slug);
            return ResponseEntity.ok(post);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
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

    @GetMapping("/search")
    public ResponseEntity<?> searchBlogs(
            @RequestParam(value = "searchTerm", required = false) String searchTerm,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(value = "page", defaultValue = "0") int page) {

        var blogResults = blogPostService.searchBlogs(searchTerm, page, size);
        return ResponseEntity.ok(blogResults.getContent());
    }
}