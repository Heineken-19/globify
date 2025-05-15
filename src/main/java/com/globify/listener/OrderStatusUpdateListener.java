package com.globify.listener;

import com.globify.entity.Invoice;
import com.globify.entity.Order;
import com.globify.entity.OrderStatus;
import com.globify.service.EmailService;
import com.globify.service.InvoiceService;
import com.globify.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
public class OrderStatusUpdateListener {

    private final OrderService orderService;
    private final EmailService emailService;
    private final InvoiceService invoiceService;

    @Autowired
    public OrderStatusUpdateListener(OrderService orderService, EmailService emailService, InvoiceService invoiceService) {
        this.orderService = orderService;
        this.emailService = emailService;
        this.invoiceService = invoiceService;
    }

    @JmsListener(destination = "order-status-queue", concurrency = "1-1")
    public void processOrderStatusUpdate(String message) {
        try {
            String[] parts = message.split(",");
            Long orderId = Long.parseLong(parts[0]);
            OrderStatus status = OrderStatus.valueOf(parts[1]);

            // ✅ Rendelés státusz frissítése
            Order order = orderService.getOrderEntityById(orderId);
            order.setStatus(status);
            orderService.saveOrder(order);

            System.out.println("✅ Státusz frissítve: " + status);

        } catch (Exception e) {
            System.err.println("❌ Hiba a státusz frissítési folyamatban: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @JmsListener(destination = "order-email-queue", concurrency = "1-1")
    public void processOrderEmail(String orderIdString) {
        try {
            Long orderId = Long.parseLong(orderIdString);
            Order order = orderService.getOrderEntityById(orderId);
            emailService.sendOrderUpdate(order);
            System.out.println("✅ Email elküldve a státusz frissítéséről: " + orderId);
        } catch (Exception e) {
            System.err.println("❌ Hiba az email küldési folyamatban: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @JmsListener(destination = "order-invoice-queue", concurrency = "1-1")
    public void processOrderInvoice(String orderIdString) {
        try {
            Long orderId = Long.parseLong(orderIdString);
            Order order = orderService.loadOrderWithItems(orderId);

            if (invoiceService.hasInvoice(order)) {
                System.out.println("❌ Ehhez a rendeléshez már létezik számla.");
                return;
            }

            Invoice invoice = invoiceService.generateInvoice(order);
            File pdfFile = invoiceService.getInvoicePdfFile(invoice);
            emailService.sendOrderWithInvoice(order, pdfFile);
            System.out.println("✅ Számla generálva és kiküldve: " + pdfFile.getName());

        } catch (Exception e) {
            System.err.println("❌ Hiba a számla generálási folyamatban: " + e.getMessage());
            e.printStackTrace();
        }
    }
    // ✅ Segédfüggvény a számla generálás queue-ba helyezéséhez
    private void queueOrderInvoice(Long orderId) {
        orderService.queueOrderInvoice(orderId);
        System.out.println("✅ Számla generálási kérés sorba helyezve: " + orderId);
    }
}
