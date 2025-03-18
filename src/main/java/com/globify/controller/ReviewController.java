package com.globify.controller;

import com.globify.dto.ReviewDTO;
import com.globify.entity.Review;
import com.globify.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/{productId}")
    public List<ReviewDTO> getProductReviews(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId);
    }

    @GetMapping("/{productId}/average")
    public Double getAverageRating(@PathVariable Long productId) {
        return reviewService.getAverageRating(productId);
    }

    @PostMapping("/{userId}/{productId}")
    public String addReview(@PathVariable Long userId, @PathVariable Long productId,
                            @RequestParam int rating, @RequestParam String comment) {
        reviewService.addReview(userId, productId, rating, comment);
        return "Értékelés sikeresen hozzáadva!";
    }

    @DeleteMapping("/{userId}/{reviewId}")
    public String deleteReview(@PathVariable Long userId, @PathVariable Long reviewId) {
        reviewService.deleteReview(userId, reviewId);
        return "Értékelés törölve!";
    }
}
