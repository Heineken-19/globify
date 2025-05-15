package com.globify.repository;

import com.globify.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
    public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.createdAt BETWEEN :start AND :end")
    long countTodayInvoices(LocalDateTime start, LocalDateTime end);

        Optional<Invoice> findByOrderId(Long orderId);
    }

