package com.globify.service;

import com.globify.dto.BlogPostRequestDTO;
import com.globify.dto.BlogPostResponseDTO;
import com.globify.entity.BlogPost;
import com.globify.exception.ResourceNotFoundException;
import com.globify.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogPostService {

    private final BlogPostRepository blogPostRepository;

    public List<BlogPostResponseDTO> getAllBlogPosts() {
        return blogPostRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public BlogPostResponseDTO getBlogPostBySlug(String slug) {
        return blogPostRepository.findBySlug(slug)
                .map(this::mapToResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException("BlogPost not found with slug: " + slug));
    }

    public BlogPostResponseDTO createBlogPost(BlogPostRequestDTO requestDTO) {
        if (requestDTO.getTitle() == null || requestDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }

        if (requestDTO.getSlug() == null || requestDTO.getSlug().trim().isEmpty()) {
            requestDTO.setSlug(generateSlug(requestDTO.getTitle()));
        }

        if (blogPostRepository.findBySlug(requestDTO.getSlug()).isPresent()) {
            throw new IllegalArgumentException("Slug already exists: " + requestDTO.getSlug());
        }

        BlogPost blogPost = mapToEntity(requestDTO);
        BlogPost savedPost = blogPostRepository.save(blogPost);
        return mapToResponseDTO(savedPost);
    }

    public BlogPostResponseDTO updateBlogPostById(Long id, BlogPostRequestDTO requestDTO) {
        return blogPostRepository.findById(id)
                .map(existingPost -> {
                    existingPost.setTitle(requestDTO.getTitle());
                    existingPost.setSlug(generateSlug(requestDTO.getTitle()));
                    existingPost.setDescription(requestDTO.getDescription());
                    existingPost.setContent(requestDTO.getContent());
                    existingPost.setImageUrl(requestDTO.getImageUrl());
                    existingPost.setBlogCategory(requestDTO.getBlogCategory());
                    existingPost.setHighlighted(requestDTO.getHighlighted());
                    existingPost.setAuthor(requestDTO.getAuthor());

                    BlogPost updatedPost = blogPostRepository.save(existingPost);
                    return mapToResponseDTO(updatedPost);
                })
                .orElseThrow(() -> new RuntimeException("BlogPost not found with ID: " + id));
    }

    public void deleteBlogPostById(Long id) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BlogPost not found with ID: " + id));
        blogPostRepository.delete(blogPost);
    }

    private BlogPost mapToEntity(BlogPostRequestDTO dto) {
        return BlogPost.builder()
                .title(dto.getTitle())
                .slug(dto.getSlug())
                .description(dto.getDescription())
                .content(dto.getContent())
                .imageUrl(dto.getImageUrl())
                .blogCategory(dto.getBlogCategory())
                .highlighted(dto.getHighlighted())
                .author(dto.getAuthor())
                .build();
    }

    private BlogPostResponseDTO mapToResponseDTO(BlogPost blogPost) {
        return BlogPostResponseDTO.builder()
                .id(blogPost.getId())
                .title(blogPost.getTitle())
                .slug(blogPost.getSlug())
                .description(blogPost.getDescription())
                .content(blogPost.getContent())
                .imageUrl(blogPost.getImageUrl())
                .blogCategory(blogPost.getBlogCategory())
                .highlighted(blogPost.getHighlighted())
                .author(blogPost.getAuthor())
                .build();
    }

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\s-]", "")
                .trim()
                .replaceAll("\s+", "-")
                .replaceAll("-+", "-");
    }

    public Page<BlogPost> searchBlogs(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return blogPostRepository.searchBlogs(searchTerm, pageable);
    }
}