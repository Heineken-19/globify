package com.globify.service;

import com.globify.entity.*;
import com.globify.repository.EmailLogRepository;
import com.globify.template.EmailTemplateBuilder;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


import java.io.File;
import java.util.List;

@Service
public class EmailService {

    @Value("${frontend.url}")
    private String frontendUrl;

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final EmailLogRepository emailLogRepository;
    private final SubscriberService subscriberService;
    private final EmailTemplateBuilder templateBuilder;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender, EmailLogRepository emailLogRepository, SubscriberService subscriberService, EmailTemplateBuilder templateBuilder) {
        this.mailSender = mailSender;
        this.emailLogRepository = emailLogRepository;
        this.subscriberService = subscriberService;
        this.templateBuilder = templateBuilder;
    }

    @Async
    public void sendEmailVerification(String to, String token) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;
        String subject = "Email megerősítése";
        String content = templateBuilder.buildVerificationEmail(verificationUrl);
        sendEmail(to, subject, content);
    }

    @Async
    public void sendOrderUpdate(Order order) {
        String subject = "Rendelés állapotváltozás";
        String link = frontendUrl + "/profile/orders";
        String statusLabel = getStatusLabel(order.getStatus());
        String message = "A rendelésed állapota megváltozott: " + statusLabel;
        String content = templateBuilder.buildOrderUpdateEmail(message, link);
        String email = order.getUser() != null
                ? order.getUser().getEmail()
                : order.getGuestEmail(); // 🔹 vendégek

        logger.info("📩 Email küldése a rendelés státuszfrissítésről: {}", email);

        sendEmail(email, subject, content);
    }

    public void sendOrderWithInvoice(Order order, File pdfFile) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            String recipientEmail = order.getUser() != null
                    ? order.getUser().getEmail()
                    : order.getGuestEmail();

            helper.setTo(recipientEmail);
            helper.setSubject("Számlád a rendelésről #" + order.getId());
            String recipientName = order.getUser() != null
                    ? order.getUser().getFirstName()
                    : order.getGuestEmail();

            helper.setText(
                    "Kedves " + recipientName + "!\n\n" +
                            "Köszönjük a rendelésed! Csatoltan küldjük a hivatalos számlát.\n\n" +
                            "Üdvözlettel,\nJS Global Webshop");

            helper.addAttachment(pdfFile.getName(), pdfFile);

            logger.info("📩 Számla email küldése: {}", recipientEmail);

            mailSender.send(message);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Email küldése sikertelen: " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String to, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        String subject = "Jelszó visszaállítása";
        String content = templateBuilder.buildResetPasswordEmail(resetUrl);
        sendEmail(to, subject, content);
    }

    @Async
    public void sendNewsletter(NewsletterTemplate template) {
        List<String> recipients = subscriberService.getSubscribedEmails();

        if (recipients.isEmpty()) {
            logger.warn("⚠️ Nincs feliratkozott felhasználó a hírlevélhez.");
            return;
        }

        String subject = template.getSubject();
        String message = template.getMessage();
        String imageBlock = "";

        if (template.getImageUrls() != null && !template.getImageUrls().isBlank()) {
            String[] urls = template.getImageUrls().split(",");
            StringBuilder builder = new StringBuilder();
            builder.append("<div style=\"margin: 24px auto; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px;\">");

            for (String url : urls) {
                builder.append(String.format("""
                    <img src=\"%s\" alt=\"Hírlevél kép\" style=\"width: 180px; border-radius: 12px;\"/>
                """, url.trim()));
            }

            builder.append("</div>");
            imageBlock = builder.toString();
        }

        logger.info("📨 Hírlevél küldése {} feliratkozott felhasználónak.", recipients.size());

        for (String email : recipients) {
            try {
                Subscriber subscriber = subscriberService.findByEmail(email);
                subscriberService.ensureUnsubscribeToken(subscriber);
                String unsubscribeLink = frontendUrl + "/unsubscribe?token=" + subscriber.getUnsubscribeToken();
                String content = templateBuilder.buildNewsletterEmail(message, unsubscribeLink, imageBlock);

                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");
                helper.setFrom(fromEmail);
                helper.setTo(email);
                helper.setSubject(subject);
                helper.setText(content, true);

                mailSender.send(mimeMessage);

                emailLogRepository.save(new EmailLog(email, subject, "SUCCESS", null));
                logger.info("📨 Hírlevél elküldve: {}", email);

            } catch (MessagingException e) {
                emailLogRepository.save(new EmailLog(email, subject, "FAILED", e.getMessage()));
                logger.error("⚠️ Hiba történt a hírlevél küldésekor: {} | Hiba: {}", email, e.getMessage());
            }
        }
    }

    private void sendEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            emailLogRepository.save(new EmailLog(to, subject, "SUCCESS", null));
            logger.info("📩 Email elküldve: {}", to);
        } catch (MessagingException e) {
            emailLogRepository.save(new EmailLog(to, subject, "FAILED", e.getMessage()));
            logger.error("⚠️ Email küldési hiba: {} | Hiba: {}", to, e.getMessage());
            throw new RuntimeException("Email küldése sikertelen", e);
        }
    }


    public void sendGuestCartLink(String email, String token) {
        String link = frontendUrl + "/cart?guestToken=" + token;
        String subject = "Töltsd ki a rendelésed!";
        String htmlContent = templateBuilder.buildGuestCartLinkEmail(link); // 🔹 HTML sablon
        sendEmail(email, subject, htmlContent); // 🔹 HTML email küldés
    }

    private String getStatusLabel(OrderStatus status) {
        return switch (status) {
            case PENDING -> "Függőben";
            case PAID -> "Fizetve";
            case CONFIRMED -> "Rendelés összekészítés alatt";
            case SHIPPED -> "Átadva a futárnak";
            case DELIVERED -> "Rendelés kiszállítva";
            case CANCELED -> "A rendelés lemondva";
        };
    }

    public void sendOrderConfirmationToGuest(Order order) {
        String link = frontendUrl + "/guest-orders"; // vagy bármi
        String content = templateBuilder.buildOrderUpdateEmail(
                "Köszönjük a rendelésed!", link);
        sendEmail(order.getGuestEmail(), "Rendelés visszaigazolás", content);
    }




}
