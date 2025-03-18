package com.globify.service;

import com.globify.entity.Subscriber;
import com.globify.repository.SubscriberRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubscriberService {

    private static final Logger logger = LoggerFactory.getLogger(SubscriberService.class);
    private final SubscriberRepository subscriberRepository;

    public SubscriberService(SubscriberRepository subscriberRepository) {
        this.subscriberRepository = subscriberRepository;
    }

    /**
     * Feliratkozás hírlevélre
     */
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
    public String unsubscribe(String email) {
        Optional<Subscriber> subscriber = subscriberRepository.findByEmail(email);
        if (subscriber.isPresent()) {
            subscriber.get().setSubscribed(false);
            subscriberRepository.save(subscriber.get());
            logger.info("❌ Leiratkozás: {}", email);
            return "Sikeresen leiratkoztál a hírlevélről!";
        }
        return "Nem található feliratkozás ezzel az email címmel.";
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
}
