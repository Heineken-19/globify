package com.globify.service;

import com.globify.dto.ReviewDTO;
import com.globify.entity.Review;
import com.globify.repository.ProductRepository;
import com.globify.repository.ReviewRepository;
import com.globify.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public List<ReviewDTO> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(review -> new ReviewDTO(
                        review.getId(),
                        review.getUser().getId(),
                        review.getProduct().getId(),
                        review.getProduct().getName(), // ➕ Termék neve
                        review.getRating(),
                        review.getComment(),
                        review.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void addReview(Long userId, Long productId, int rating, String comment) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Az értékelésnek 1 és 5 között kell lennie.");
        }

        Review review = new Review();
        review.setUser(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Felhasználó nem található!")));
        review.setProduct(productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Termék nem található!")));
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());

        reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("Értékelés nem található!"));

        // Ellenőrizzük, hogy az adott user az értékelés tulajdonosa-e
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("Nem törölheted más felhasználó értékelését!");
        }

        reviewRepository.deleteById(reviewId);
    }

    public Double getAverageRating(Long productId) {
        Double average = reviewRepository.findAverageRatingByProductId(productId);
        return (average != null) ? Math.round(average * 10.0) / 10.0 : 0.0; // Kerekítés egy tizedesjegyre
    }
}
