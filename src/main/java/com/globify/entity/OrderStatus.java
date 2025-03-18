package com.globify.entity;

public enum OrderStatus {
    PENDING,     // Függőben (rendelés leadva, de nem fizetett)
    PAID,        // Kifizetve
    CONFIRMED,   // Jóváhagyott rendelés
    SHIPPED,     // Kiszállítás alatt
    DELIVERED,   // Kézbesítve
    CANCELED     // Lemondva
}
