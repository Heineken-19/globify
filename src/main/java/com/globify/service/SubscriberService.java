package com.globify.service;

import com.globify.entity.Subscriber;
import com.globify.repository.SubscriberRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SubscriberService {

    private static final Logger logger = LoggerFactory.getLogger(SubscriberService.class);
    private final SubscriberRepository subscriberRepository;

    public SubscriberService(SubscriberRepository subscriberRepository) {
        this.subscriberRepository = subscriberRepository;
    }

    public void ensureUnsubscribeToken(Subscriber subscriber) {
        if (subscriber.getUnsubscribeToken() == null) {
            subscriber.setUnsubscribeToken(UUID.randomUUID().toString());
            subscriberRepository.save(subscriber);
        }
    }

    public String subscribe(String email) {
        Optional<Subscriber> existingSubscriber = subscriberRepository.findByEmail(email);

        if (existingSubscriber.isPresent()) {
            Subscriber subscriber = existingSubscriber.get();
            if (subscriber.isSubscribed()) {
                return "Már feliratkozott a hírlevélre.";
            }
            subscriber.setSubscribed(true);
            subscriberRepository.save(subscriber);
        } else {
            Subscriber newSubscriber = new Subscriber();
            newSubscriber.setEmail(email);
            newSubscriber.setSubscribed(true);
            subscriberRepository.save(newSubscriber);
        }

        logger.info("✅ Új feliratkozás: {}", email);
        return "Sikeresen feliratkoztál a hírlevélre!";
    }

    /**
     * Leiratkozás hírlevélről
     */
    public boolean unsubscribeByToken(String token) {
        Optional<Subscriber> subscriberOpt = subscriberRepository.findAll().stream()
                .filter(s -> token.equals(s.getUnsubscribeToken()))
                .findFirst();

        if (subscriberOpt.isPresent()) {
            Subscriber subscriber = subscriberOpt.get();
            subscriber.setSubscribed(false);
            subscriber.setUnsubscribeToken(null); // opcionálisan törölheted is a tokent
            subscriberRepository.save(subscriber);
            logger.info("❌ Leiratkozás token alapján: {}", subscriber.getEmail());
            return true;
        }

        return false;
    }

    /**
     * Feliratkozott felhasználók listázása
     */
    public List<String> getSubscribedEmails() {
        return subscriberRepository.findAll().stream()
                .filter(Subscriber::isSubscribed)
                .map(Subscriber::getEmail)
                .toList();
    }

    public Subscriber findByEmail(String email) {
        return subscriberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Nincs ilyen feliratkozó: " + email));
    }

    public boolean unsubscribeByEmail(String email) {
        Optional<Subscriber> subscriberOpt = subscriberRepository.findByEmail(email);
        if (subscriberOpt.isPresent()) {
            Subscriber subscriber = subscriberOpt.get();
            subscriber.setSubscribed(false);
            subscriberRepository.save(subscriber);
            return true;
        }
        return false;
    }
}
