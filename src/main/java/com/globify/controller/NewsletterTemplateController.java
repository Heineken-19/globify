package com.globify.controller;

import com.globify.dto.NewsletterTemplateRequest;
import com.globify.entity.NewsletterTemplate;
import com.globify.service.NewsletterTemplateService;
import com.globify.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/newsletter/templates")
public class NewsletterTemplateController {

    private final NewsletterTemplateService templateService;
    private final EmailService emailService;

    public NewsletterTemplateController(NewsletterTemplateService templateService, EmailService emailService) {
        this.templateService = templateService;
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<NewsletterTemplate> create(@RequestBody NewsletterTemplateRequest request) {
        return ResponseEntity.ok(
                templateService.save(request.getSubject(), request.getMessage(), request.getImageUrls())
        );
    }
    @GetMapping
    public ResponseEntity<List<NewsletterTemplate>> getAll() {
        return ResponseEntity.ok(templateService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsletterTemplate> update(
            @PathVariable Long id,
            @RequestBody NewsletterTemplate updated
    ) {
        NewsletterTemplate template = templateService.findById(id);
        template.setSubject(updated.getSubject());
        template.setMessage(updated.getMessage());
        return ResponseEntity.ok(templateService.save(template));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        templateService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<String> sendNewsletter(@PathVariable Long id) {
        NewsletterTemplate template = templateService.findById(id);
        emailService.sendNewsletter(template);
        return ResponseEntity.ok("Hírlevél kiküldve a sablon alapján.");
    }
}
