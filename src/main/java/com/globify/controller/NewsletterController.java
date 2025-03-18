package com.globify.controller;

import com.globify.service.EmailService;
import com.globify.service.SubscriberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    private final SubscriberService subscriberService;
    private final EmailService emailService;

    public NewsletterController(SubscriberService subscriberService, EmailService emailService) {
        this.subscriberService = subscriberService;
        this.emailService = emailService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@RequestParam String email) {
        String response = subscriberService.subscribe(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<String> unsubscribe(@RequestParam String email) {
        String response = subscriberService.unsubscribe(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendNewsletter(@RequestBody Map<String, String> requestData) {
        String subject = requestData.get("subject");
        String message = requestData.get("message");

        if (subject == null || message == null) {
            return ResponseEntity.badRequest().body("Hibás kérés: Subject és message mezők szükségesek.");
        }

        emailService.sendNewsletter(subject, message);
        return ResponseEntity.ok("Hírlevél kiküldése folyamatban.");
    }
}
