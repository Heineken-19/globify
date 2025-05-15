package com.globify.controller;

import com.globify.dto.ContactMessage;
import jakarta.mail.internet.MimeMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final JavaMailSender mailSender;

    public ContactController(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @PostMapping
    public ResponseEntity<String> sendMessage(@RequestBody ContactMessage contact) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

            helper.setFrom("info@jsglobal.hu");
            helper.setTo("info@jsglobal.hu");
            helper.setSubject("Új kapcsolatfelvétel a weboldalról");
            helper.setText(
                    "Név: " + contact.getName() + "\n" +
                            "Email: " + contact.getEmail() + "\n\n" +
                            contact.getMessage()
            );

            mailSender.send(message);
            return ResponseEntity.ok("Üzenet sikeresen elküldve");
        } catch (Exception e) {
            throw new RuntimeException("Hiba történt az email küldésekor: " + e.getMessage());
        }
    }
}

