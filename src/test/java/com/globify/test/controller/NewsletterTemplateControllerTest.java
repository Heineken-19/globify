package com.globify.test.controller;

import com.globify.controller.NewsletterTemplateController;
import com.globify.dto.NewsletterTemplateRequest;
import com.globify.entity.NewsletterTemplate;
import com.globify.service.EmailService;
import com.globify.service.NewsletterTemplateService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NewsletterTemplateControllerTest {

    private NewsletterTemplateService templateService;
    private EmailService emailService;
    private NewsletterTemplateController controller;

    @BeforeEach
    void setUp() {
        templateService = mock(NewsletterTemplateService.class);
        emailService = mock(EmailService.class);
        controller = new NewsletterTemplateController(templateService, emailService);
    }

    @Test
    void testCreateNewsletterTemplate() {
        NewsletterTemplateRequest request = new NewsletterTemplateRequest();
        request.setSubject("Subject");
        request.setMessage("Message");
        request.setImageUrls(Collections.singletonList("url"));

        NewsletterTemplate expectedTemplate = new NewsletterTemplate();
        when(templateService.save(request.getSubject(), request.getMessage(), request.getImageUrls())).thenReturn(expectedTemplate);

        ResponseEntity<NewsletterTemplate> response = controller.create(request);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(expectedTemplate, response.getBody());
    }

    @Test
    void testGetAllTemplates() {
        List<NewsletterTemplate> templates = Arrays.asList(new NewsletterTemplate(), new NewsletterTemplate());
        when(templateService.findAll()).thenReturn(templates);

        ResponseEntity<List<NewsletterTemplate>> response = controller.getAll();
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(templates, response.getBody());
    }

    @Test
    void testUpdateTemplate() {
        Long id = 1L;
        NewsletterTemplate existing = new NewsletterTemplate();
        NewsletterTemplate updated = new NewsletterTemplate();
        updated.setSubject("Updated");
        updated.setMessage("Updated message");

        when(templateService.findById(id)).thenReturn(existing);
        when(templateService.save(existing)).thenReturn(existing);

        ResponseEntity<NewsletterTemplate> response = controller.update(id, updated);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(existing, response.getBody());
    }

    @Test
    void testDeleteTemplate() {
        Long id = 1L;
        ResponseEntity<Void> response = controller.delete(id);

        verify(templateService).deleteById(id);
        assertEquals(204, response.getStatusCodeValue());
    }

    @Test
    void testSendNewsletter() {
        Long id = 1L;
        NewsletterTemplate template = new NewsletterTemplate();
        when(templateService.findById(id)).thenReturn(template);

        ResponseEntity<String> response = controller.sendNewsletter(id);
        verify(emailService).sendNewsletter(template);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Hírlevél kiküldve a sablon alapján.", response.getBody());
    }
}
