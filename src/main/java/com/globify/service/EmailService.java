package com.globify.service;

import com.globify.entity.EmailLog;
import com.globify.repository.EmailLogRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class EmailService {

    @Value("${frontend.url}")
    private String frontendUrl;

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final EmailLogRepository emailLogRepository;
    private final SubscriberService subscriberService;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender, EmailLogRepository emailLogRepository, SubscriberService subscriberService) {
        this.mailSender = mailSender;
        this.emailLogRepository = emailLogRepository;
        this.subscriberService = subscriberService;
    }

    @Async
    public void sendEmailVerification(String to, String token) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;
        String subject = "Email megerősítése";

        String content = """
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0px 2px 10px rgba(0,0,0,0.1);
                    }
                    .email-header {
                        background: #28a745;
                        color: #ffffff;
                        text-align: center;
                        padding: 10px 0;
                        font-size: 24px;
                        font-weight: bold;
                        border-radius: 10px 10px 0 0;
                    }
                    .email-content {
                        padding: 20px;
                        font-size: 16px;
                        color: #333;
                    }
                    .cta-button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 20px;
                        background: #28a745;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    }
                    .email-footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                        padding-top: 10px;
                        border-top: 1px solid #ddd;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">Email Megerősítés</div>
                    <div class="email-content">
                        <p>Kedves Felhasználó!</p>
                        <p>Kérlek kattints az alábbi gombra az email címed megerősítéséhez:</p>
                        <a href="%s" class="cta-button">Email megerősítése</a>
                        <p>Ha nem te regisztráltál, hagyd figyelmen kívül ezt az üzenetet.</p>
                    </div>
                    <div class="email-footer">
                        <p>Üdvözlettel,<br>Globify Csapat</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(verificationUrl);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(message);

            // Sikeres email küldés loggolás
            emailLogRepository.save(new EmailLog(to, subject, "SUCCESS", null));
            logger.info("📩 Email megerősítés elküldve: Címzett={}", to);

        } catch (MessagingException e) {
            // Sikertelen küldés loggolás
            emailLogRepository.save(new EmailLog(to, subject, "FAILED", e.getMessage()));
            logger.error("⚠️ Hiba történt az email megerősítés küldésekor: Címzett={}, Hiba={}", to, e.getMessage());
            throw new RuntimeException("Email küldése sikertelen", e);
        }
    }


    @Async
    public void sendOrderUpdate(String to, String message, Long orderId) {
        String subject = "Rendelés állapotváltozás";

        String content = """
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0px 2px 10px rgba(0,0,0,0.1);
                    }
                    .email-header {
                        background: #28a745;
                        color: #ffffff;
                        text-align: center;
                        padding: 10px 0;
                        font-size: 24px;
                        font-weight: bold;
                        border-radius: 10px 10px 0 0;
                    }
                    .email-content {
                        padding: 20px;
                        font-size: 16px;
                        color: #333;
                    }
                    .cta-button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 20px;
                        background: #28a745;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    }
                    .email-footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                        padding-top: 10px;
                        border-top: 1px solid #ddd;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">Webshop Rendelés</div>
                    <div class="email-content">
                        <p>Kedves Vásárló!</p>
                        <p>%s</p>
                        <p>Kattints az alábbi gombra a rendelésed megtekintéséhez:</p>
                        <a href="%s/admin/order" class="cta-button">Rendelés megtekintése</a>
                        ""\".formatted(frontendUrl);
                    </div>
                    <div class="email-footer">
                        <p>Ha bármilyen kérdésed van, lépj kapcsolatba velünk: <br>
                        <a href="mailto:support@globify.hu">support@globify.hu</a></p>
                        <p>Üdvözlettel,<br>Webshop Csapat</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(message, orderId);

        try {
            MimeMessage email = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(email, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(email);

            emailLogRepository.save(new EmailLog(to, subject, "SUCCESS", null));

            logger.info("📨 Email sikeresen elküldve: Címzett={}, Tárgy={}, RendelésID={}", to, subject, orderId);

        } catch (MessagingException e) {
            // ❌ Hiba loggolás adatbázisba
            emailLogRepository.save(new EmailLog(to, subject, "FAILED", e.getMessage()));

            logger.error("⚠️ Hiba történt az email küldésekor: Címzett={}, RendelésID={}, Hiba={}",
                    to, orderId, e.getMessage());
            throw new RuntimeException("Email küldése sikertelen!", e);
        }
    }

    @Async
    public void sendPasswordResetEmail(String to, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        String subject = "Jelszó visszaállítása";

        String content = """
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0px 2px 10px rgba(0,0,0,0.1);
                    }
                    .email-header {
                        background: #dc3545;
                        color: #ffffff;
                        text-align: center;
                        padding: 10px 0;
                        font-size: 24px;
                        font-weight: bold;
                        border-radius: 10px 10px 0 0;
                    }
                    .email-content {
                        padding: 20px;
                        font-size: 16px;
                        color: #333;
                    }
                    .cta-button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 20px;
                        background: #dc3545;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    }
                    .email-footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                        padding-top: 10px;
                        border-top: 1px solid #ddd;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">Jelszó visszaállítás</div>
                    <div class="email-content">
                        <p>Kedves Felhasználó!</p>
                        <p>Úgy tűnik, elfelejtetted a jelszavad. Kérlek kattints az alábbi gombra a visszaállításhoz:</p>
                        <a href="%s" class="cta-button">Jelszó visszaállítása</a>
                        <p>Ha nem te kérted ezt a műveletet, hagyd figyelmen kívül ezt az üzenetet.</p>
                    </div>
                    <div class="email-footer">
                        <p>Üdvözlettel,<br>Globify Csapat</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(resetUrl);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(message);

            emailLogRepository.save(new EmailLog(to, subject, "SUCCESS", null));
            logger.info("📩 Jelszó-visszaállító email elküldve: Címzett={}", to);

        } catch (MessagingException e) {
            emailLogRepository.save(new EmailLog(to, subject, "FAILED", e.getMessage()));
            logger.error("⚠️ Hiba történt a jelszó-visszaállító email küldésekor: Címzett={}, Hiba={}", to, e.getMessage());
            throw new RuntimeException("Jelszó-visszaállító email küldése sikertelen", e);
        }
    }

    @Async
    public void sendNewsletter(String subject, String message) {
        List<String> recipients = subscriberService.getSubscribedEmails();


        if (recipients.isEmpty()) {
            logger.warn("⚠️ Nincs feliratkozott felhasználó a hírlevélhez.");
            return;
        }

        logger.info("📨 Hírlevél küldése {} feliratkozott felhasználónak.", recipients.size());

        String contentTemplate = """
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                    text-align: center;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 2px 10px rgba(0,0,0,0.1);
                }
                .email-header {
                    background: #007bff;
                    color: #ffffff;
                    text-align: center;
                    padding: 10px 0;
                    font-size: 24px;
                    font-weight: bold;
                    border-radius: 10px 10px 0 0;
                }
                .email-content {
                    padding: 20px;
                    font-size: 16px;
                    color: #333;
                }
                .unsubscribe-button {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 20px;
                    background: #28a745;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                }
                .unsubscribe-button:hover {
                    background: #218838;
                }
                .email-footer {
                    text-align: center;
                    font-size: 12px;
                    color: #777;
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 1px solid #ddd;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">🌟 Hírlevél 🌟</div>
                <div class="email-content">
                    <p>Kedves Olvasónk!</p>
                    <p>%s</p>
                    <p>Köszönjük, hogy velünk vagy!</p>
                    <a href="%s" class="unsubscribe-button">Leiratkozás a hírlevélről</a>
                </div>
                <div class="email-footer">
                    <p>Ha bármilyen kérdésed van, lépj kapcsolatba velünk:<br>
                    <a href="mailto:support@globify.com">support@globify.com</a></p>
                    <p>Üdvözlettel,<br>Globify Csapat</p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(message, frontendUrl + "/unsubscribe?email={EMAIL}");

        for (String email : recipients) {
            try {
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");
                helper.setFrom(fromEmail);
                helper.setTo(email);
                helper.setSubject(subject);
                helper.setText(contentTemplate.replace("{EMAIL}", email).formatted(message), true);
                mailSender.send(mimeMessage);

                emailLogRepository.save(new EmailLog(email, subject, "SUCCESS", null));
                logger.info("📨 Hírlevél elküldve: {}", email);

            } catch (MessagingException e) {
                emailLogRepository.save(new EmailLog(email, subject, "FAILED", e.getMessage()));
                logger.error("⚠️ Hiba történt a hírlevél küldésekor: {} | Hiba: {}", email, e.getMessage());
            }
        }
    }
}
