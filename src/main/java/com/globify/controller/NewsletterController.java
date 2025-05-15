package com.globify.controller;

import com.globify.entity.NewsletterTemplate;
import com.globify.entity.Subscriber;
import com.globify.repository.SubscriberRepository;
import com.globify.service.EmailService;
import com.globify.service.NewsletterTemplateService;
import com.globify.service.SubscriberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    private final NewsletterTemplateService templateService;
    private final SubscriberService subscriberService;
    private final EmailService emailService;
    private final SubscriberRepository subscriberRepository;

    public NewsletterController(NewsletterTemplateService templateService,SubscriberService subscriberService, EmailService emailService, SubscriberRepository subscriberRepository) {
        this.templateService = templateService;
        this.subscriberService = subscriberService;
        this.emailService = emailService;
        this.subscriberRepository = subscriberRepository;
    }

    @GetMapping("/subscribers")
    public List<Subscriber> getAllSubscribers() {
        return subscriberRepository.findAll();
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@RequestParam String email) {
        String response = subscriberService.subscribe(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<String> unsubscribe(@RequestParam String email) {
        boolean success = subscriberService.unsubscribeByEmail(email);
        if (success) {
            return ResponseEntity.ok("Sikeresen leiratkoztál a hírlevélről.");
        } else {
            return ResponseEntity.badRequest().body("A megadott email cím nem található a feliratkozók között.");
        }
    }

    @GetMapping("/unsubscribe")
    public ResponseEntity<String> unsubscribeWithToken(@RequestParam String token) {
        boolean success = subscriberService.unsubscribeByToken(token);
        if (success) {
            return ResponseEntity.ok("Sikeresen leiratkoztál a hírlevélről.");
        } else {
            return ResponseEntity.badRequest().body("Érvénytelen vagy lejárt leiratkozási link.");
        }
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<String> sendNewsletter(@PathVariable Long id) {
        NewsletterTemplate template = templateService.findById(id);
        emailService.sendNewsletter(template);
        return ResponseEntity.ok("Hírlevél kiküldése folyamatban.");
    }
}
