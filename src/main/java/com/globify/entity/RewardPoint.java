package com.globify.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RewardPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User user;

    private int points; // pozitív vagy negatív
    private String description; // Pl: "Rendelés #1234", "Rendelés törlés"
    private LocalDateTime createdAt;

    public RewardPoint(User user, int points, String description) {
        this.user = user;
        this.points = points;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }
}