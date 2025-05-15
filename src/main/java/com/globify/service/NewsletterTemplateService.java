package com.globify.service;

import com.globify.entity.NewsletterTemplate;
import com.globify.repository.NewsletterTemplateRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NewsletterTemplateService {

    private final NewsletterTemplateRepository repository;

    public NewsletterTemplateService(NewsletterTemplateRepository repository) {
        this.repository = repository;
    }

    public NewsletterTemplate save(String subject, String message, List<String> imageUrls) {
        NewsletterTemplate template = NewsletterTemplate.builder()
                .subject(subject)
                .message(message)
                .imageUrls(String.join(",", imageUrls))
                .createdAt(LocalDateTime.now())
                .build();
        return repository.save(template);
    }


    public NewsletterTemplate save(NewsletterTemplate template) {
        return repository.save(template);
    }

    public List<NewsletterTemplate> findAll() {
        return repository.findAll();
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public NewsletterTemplate findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Nem található sablon."));
    }
}
