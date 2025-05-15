package com.globify.service;


import com.globify.dto.*;
import com.globify.entity.*;
import com.globify.repository.*;
import jakarta.jms.Queue;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.jms.core.JmsTemplate;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;
    private final OrderBillingRepository orderBillingRepository;
    private final OrderShippingRepository orderShippingRepository;
    private final UserRepository userRepository;
    private final RewardPointService rewardPointService;
    private final InvoiceService invoiceService;
    private final InvoiceRepository invoiceRepository;
    private final JmsTemplate jmsTemplate;
    private final Queue statusQueue;
    private final Queue invoiceQueue;
    private final Queue emailQueue;

    @PersistenceContext
    private EntityManager entityManager;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, EmailService emailService,
                        OrderShippingRepository orderShippingRepository,
                        OrderBillingRepository orderBillingRepository, UserRepository userRepository,
                        RewardPointService rewardPointService,
                        InvoiceService invoiceService,
                        InvoiceRepository invoiceRepository, JmsTemplate jmsTemplate, Queue statusQueue, Queue invoiceQueue, Queue emailQueue) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.emailService = emailService;
        this.orderBillingRepository = orderBillingRepository;
        this.orderShippingRepository = orderShippingRepository;
        this.userRepository = userRepository;
        this.rewardPointService = rewardPointService;
        this.invoiceService = invoiceService;
        this.invoiceRepository = invoiceRepository;
        this.jmsTemplate = jmsTemplate;
        this.statusQueue = statusQueue;
        this.invoiceQueue = invoiceQueue;
        this.emailQueue = emailQueue;
    }

    @Transactional
    public Long createOrder(String userEmail, OrderRequestDTO orderRequest) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Order order = new Order();
            order.setUser(user);
            order.setTotalPrice(orderRequest.getTotalPrice());
            order.setFinalPrice(orderRequest.getFinalPrice());
            order.setDiscountAmount(orderRequest.getDiscountAmount());
            order.setShippingCost(orderRequest.getShippingCost());
            order.setDiscountName(orderRequest.getDiscountName());
            order.setCouponCode(orderRequest.getCouponCode());
            order.setStatus(OrderStatus.valueOf(orderRequest.getStatus()));
            order.setPaymentMethod(orderRequest.getPaymentMethod());

            if (orderRequest.getUsedRewardPoints() > 0) {
                rewardPointService.usePoints(user, orderRequest.getUsedRewardPoints(), "Pont felhasználás rendeléshez");
            }
            order.setUsedRewardPoints(orderRequest.getUsedRewardPoints()); // el is mentjük

            // ✅ Először mentsük el az order-t
            Order savedOrder = orderRepository.save(order);

            // 🟢 Billing mentése
            if (orderRequest.getBillingData() != null) {
                OrderBilling orderBilling = new OrderBilling();
                orderBilling.setOrder(savedOrder); // Most már van order_id
                orderBilling.setCompanyName(orderRequest.getBillingData().getCompanyName());
                orderBilling.setTaxNumber(orderRequest.getBillingData().getTaxNumber());
                orderBilling.setStreet(orderRequest.getBillingData().getStreet());
                orderBilling.setCity(orderRequest.getBillingData().getCity());
                orderBilling.setPostalCode(orderRequest.getBillingData().getPostalCode());
                orderBilling.setCountry(orderRequest.getBillingData().getCountry());
                orderBilling.setBillingType(orderRequest.getBillingData().getBillingType());
                orderBillingRepository.save(orderBilling);
                order.setBilling(orderBilling);
            }

            // 🟢 Shipping mentése
            if (orderRequest.getShippingMethod() != null) {
                OrderShipping orderShipping = new OrderShipping();
                orderShipping.setOrder(savedOrder);
                orderShipping.setShippingMethod(orderRequest.getShippingMethod().name());
                orderShipping.setShippingPoint(orderRequest.getShippingPoint());
                orderShipping.setShippingAddress(orderRequest.getShippingAddress());
                orderShippingRepository.save(orderShipping);
                order.setShipping(orderShipping);
            }

            // 🟢 OrderItem mentése
            List<OrderItem> items = orderRequest.getItems().stream().map(item -> {
                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));

                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(savedOrder);
                orderItem.setProduct(product);
                orderItem.setQuantity(item.getQuantity());
                orderItem.setPrice(item.getPrice());
                return orderItem;
            }).collect(Collectors.toList());

            order.setOrderItems(items);

            // ✅ Frissítsük az order-t
            orderRepository.save(order);

            rewardPointService.addPoints(user, order.getFinalPrice().intValue(), "Pont jóváírás rendeléshez");

            entityManager.flush(); // Kényszerített flush a tranzakció végén
            System.out.println("✅ Order successfully saved with ID: " + savedOrder.getId());

            // ✅ Visszaadjuk az order ID-t
            return savedOrder.getId();

        } catch (Exception e) {
            e.printStackTrace(); // Hiba kiírása logba
            throw new RuntimeException("Order saving failed: " + e.getMessage());
        }
    }

    public List<AdminOrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(AdminOrderDTO::fromEntity)
                .toList();
    }



    public Page<UserOrderDTO> getUserOrders(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findByUserId(user.getId(), pageable)
                .map(UserOrderDTO::new);
    }

    public OrderDTO getOrderById(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .filter(o -> o.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Rendelés nem található vagy nincs jogosultság!"));

        return new OrderDTO(order);
    }

    @Transactional
    public void cancelOrder(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .filter(o -> o.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Rendelés nem található vagy nincs jogosultság!"));

        if (order.getStatus() == OrderStatus.PENDING) {
            order.setStatus(OrderStatus.CANCELED);
            orderRepository.save(order);

            rewardPointService.addPoints(user, -order.getFinalPrice().intValue(), "Lemondott rendelés - jóváírt pont visszavonva");

            if (order.getUsedRewardPoints() > 0) {
                rewardPointService.addPoints(user, order.getUsedRewardPoints(), "Lemondott rendelés - felhasznált pont visszatérítés");
            }
        } else {
            throw new RuntimeException("A rendelést nem lehet törölni!");
        }
    }

    @Transactional(readOnly = true)
    public Order getOrderEntityById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
    }


    @Transactional
    public void queueOrderStatusUpdate(Long orderId, OrderStatus status) {
        // Queue a status update message to the ActiveMQ
        jmsTemplate.convertAndSend("order-status-queue", orderId + "," + status.name());
        System.out.println("✅ Státusz frissítési kérés sorba helyezve: " + orderId + " -> " + status);
    }

    @Transactional
    public void saveOrder(Order order) {
        orderRepository.save(order);
        System.out.println("✅ Rendelés mentve: " + order.getId());
    }

    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Rendelés nem található!"));

        order.setStatus(status);
        orderRepository.save(order);

        System.out.println("✅ Státusz frissítve: " + status);

        // ✅ Csak akkor helyezzük sorba, ha ténylegesen változott a státusz
        if (status == OrderStatus.PAID) {
            queueOrderInvoice(orderId); // ✅ Csak egy helyen tesszük sorba
        }
        queueOrderEmail(orderId);
    }

    @Transactional
    public void queueOrderEmail(Long orderId) {
        jmsTemplate.convertAndSend("order-email-queue", orderId.toString());
        System.out.println("✅ Email küldési kérés sorba helyezve: " + orderId);
    }

    @Transactional
    public void queueOrderInvoice(Long orderId) {
        jmsTemplate.convertAndSend("order-invoice-queue", orderId.toString());
        System.out.println("✅ Számla generálási kérés sorba helyezve: " + orderId);
    }

    @Transactional
    public Order placeGuestOrder(GuestOrderRequestDTO orderRequest) {
        Order order = new Order();
        order.setGuestEmail(orderRequest.getEmail());
        order.setTotalPrice(orderRequest.getTotalPrice());
        order.setFinalPrice(orderRequest.getFinalPrice());
        order.setDiscountAmount(orderRequest.getDiscountAmount());
        order.setShippingCost(orderRequest.getShippingCost());
        order.setCouponCode(orderRequest.getCouponCode());
        order.setDiscountName(orderRequest.getDiscountName());
        order.setStatus(OrderStatus.PENDING);
        try {
            order.setPaymentMethod(PaymentMethod.valueOf(orderRequest.getPaymentMethod().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Érvénytelen fizetési mód: " + orderRequest.getPaymentMethod());
        }
        order.setCreatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        // 🟢 Billing mentése
        if (orderRequest.getBillingData() != null) {
            OrderBilling orderBilling = new OrderBilling();
            orderBilling.setOrder(savedOrder); // Most már van order_id
            orderBilling.setCompanyName(orderRequest.getBillingData().getCompanyName());
            orderBilling.setTaxNumber(orderRequest.getBillingData().getTaxNumber());
            orderBilling.setStreet(orderRequest.getBillingData().getStreet());
            orderBilling.setCity(orderRequest.getBillingData().getCity());
            orderBilling.setPostalCode(orderRequest.getBillingData().getPostalCode());
            orderBilling.setCountry(orderRequest.getBillingData().getCountry());
            orderBilling.setBillingType(orderRequest.getBillingData().getBillingType());
            orderBillingRepository.save(orderBilling);
            order.setBilling(orderBilling);
        }

        // 🟢 Shipping mentése
        if (orderRequest.getShippingMethod() != null) {
            OrderShipping orderShipping = new OrderShipping();
            orderShipping.setOrder(savedOrder);
            orderShipping.setShippingMethod(orderRequest.getShippingMethod().name());
            orderShipping.setShippingPoint(orderRequest.getShippingPoint());
            orderShipping.setShippingAddress(orderRequest.getShippingAddress());
            orderShippingRepository.save(orderShipping);
            order.setShipping(orderShipping);
        }

        List<OrderItem> items = orderRequest.getItems().stream().map(item -> {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(item.getPrice());
            return orderItem;
        }).collect(Collectors.toList());

        order.setOrderItems(items);
        orderRepository.save(order);

        emailService.sendOrderConfirmationToGuest(order);

        return savedOrder;
    }

    @Transactional(readOnly = true)
    public Order loadOrderWithItems(Long orderId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    // 🔸 Az összes kapcsolódó entitást betöltjük
                    order.getOrderItems().size();
                    return order;
                })
                .orElseThrow(() -> new RuntimeException("Rendelés nem található!"));
    }
}
