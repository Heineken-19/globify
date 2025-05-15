package com.globify.test.controller;

import com.globify.controller.NewsletterController;
import com.globify.entity.NewsletterTemplate;
import com.globify.entity.Subscriber;
import com.globify.repository.SubscriberRepository;
import com.globify.service.EmailService;
import com.globify.service.NewsletterTemplateService;
import com.globify.service.SubscriberService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NewsletterControllerTest {

    @Mock private NewsletterTemplateService templateService;
    @Mock private SubscriberService subscriberService;
    @Mock private EmailService emailService;
    @Mock private SubscriberRepository subscriberRepository;

    @InjectMocks
    private NewsletterController newsletterController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllSubscribers() {
        List<Subscriber> mockList = List.of(new Subscriber(), new Subscriber());
        when(subscriberRepository.findAll()).thenReturn(mockList);

        List<Subscriber> result = newsletterController.getAllSubscribers();

        assertEquals(2, result.size());
    }

    @Test
    void testSubscribe() {
        when(subscriberService.subscribe("test@example.com")).thenReturn("Subscribed");

        ResponseEntity<String> response = newsletterController.subscribe("test@example.com");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Subscribed", response.getBody());
    }

    @Test
    void testUnsubscribe_Success() {
        when(subscriberService.unsubscribeByEmail("test@example.com")).thenReturn(true);

        ResponseEntity<String> response = newsletterController.unsubscribe("test@example.com");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Sikeresen leiratkoztál a hírlevélről.", response.getBody());
    }

    @Test
    void testUnsubscribe_Failure() {
        when(subscriberService.unsubscribeByEmail("test@example.com")).thenReturn(false);

        ResponseEntity<String> response = newsletterController.unsubscribe("test@example.com");

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void testUnsubscribeWithToken_Success() {
        when(subscriberService.unsubscribeByToken("valid-token")).thenReturn(true);

        ResponseEntity<String> response = newsletterController.unsubscribeWithToken("valid-token");

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testUnsubscribeWithToken_Failure() {
        when(subscriberService.unsubscribeByToken("invalid-token")).thenReturn(false);

        ResponseEntity<String> response = newsletterController.unsubscribeWithToken("invalid-token");

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void testSendNewsletter() {
        NewsletterTemplate template = new NewsletterTemplate();
        when(templateService.findById(1L)).thenReturn(template);

        ResponseEntity<String> response = newsletterController.sendNewsletter(1L);

        verify(emailService).sendNewsletter(template);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Hírlevél kiküldése folyamatban.", response.getBody());
    }
}
