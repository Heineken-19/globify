package com.globify.service;


import com.globify.dto.AdminOrderDTO;
import com.globify.dto.OrderDTO;
import com.globify.dto.OrderRequestDTO;
import com.globify.dto.UserOrderDTO;
import com.globify.entity.*;
import com.globify.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;
    private final BillingRepository billingRepository;
    private final OrderBillingRepository orderBillingRepository;
    private final OrderShippingRepository orderShippingRepository;
    private final UserRepository userRepository;
    private final CouponService couponService;
    private final DiscountService discountService;

    @PersistenceContext
    private EntityManager entityManager;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, EmailService emailService, BillingRepository billingRepository, OrderShippingRepository orderShippingRepository, OrderBillingRepository orderBillingRepository, UserRepository userRepository, CouponService couponService, DiscountService discountService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.emailService = emailService;
        this.billingRepository = billingRepository;
        this.orderBillingRepository = orderBillingRepository;
        this.orderShippingRepository = orderShippingRepository;
        this.userRepository = userRepository;
        this.couponService = couponService;
        this.discountService = discountService;
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
                .map(UserOrderDTO::new); // ✅ Már tartalmazza a termékeket
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
        } else {
            throw new RuntimeException("A rendelést nem lehet törölni!");
        }
    }

    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Rendelés nem található!"));

        order.setStatus(status);
        orderRepository.save(order);


        // Küldjünk értesítést a vásárlónak
        if (status == OrderStatus.PAID || status == OrderStatus.SHIPPED || status == OrderStatus.CONFIRMED) {
            String message = String.format("A rendelésed állapota megváltozott: %s", status);
            emailService.sendOrderUpdate(order.getUser().getEmail(), message, orderId);
        }
    }
}
