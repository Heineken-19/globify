package com.globify.listener;

import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class MessageListener {

    @JmsListener(destination = "test-queue")
    public void receiveMessage(String message) {
        System.out.println("Fogadott üzenet: " + message);
    }
}
