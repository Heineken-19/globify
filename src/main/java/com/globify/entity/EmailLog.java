package com.globify.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "email_logs")
public class EmailLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipient;
    private String subject;
    private String status;
    private String errorMessage;

    private LocalDateTime sentAt;

    public EmailLog() {}

    public EmailLog(String recipient, String subject, String status, String errorMessage) {
        this.recipient = recipient;
        this.subject = subject;
        this.status = status;
        this.errorMessage = errorMessage;
        this.sentAt = LocalDateTime.now();
    }
}
