package com.globify.test;

import java.util.Properties;

import com.globify.service.EmailService;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

public class SmtpTest {
    public static void main(String[] args) {
        final String username = "info@jsglobal.hu";
        final String password = "Globify123";

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true"); // STARTTLS legyen engedélyezve
        props.put("mail.smtp.host", "smtp.rackhost.hu");
        props.put("mail.smtp.port", "587"); // Használj 587-es portot
        props.put("mail.smtp.ssl.trust", "smtp.rackhost.hu");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("info@jsglobal.hu"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse("sutooliver97@gmail.com"));
            message.setSubject("SMTP Teszt");
            message.setText("Ez egy teszt email Rackhost SMTP-n keresztül.");

            Transport.send(message);
            System.out.println("Email sikeresen elküldve!");

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

}
