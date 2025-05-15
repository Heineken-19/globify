package com.globify.controller;

import com.globify.dto.RewardPointBalanceDTO;
import com.globify.dto.RewardPointDTO;
import com.globify.dto.RewardPointRequest;
import com.globify.entity.User;
import com.globify.entity.RewardPoint;
import com.globify.security.CustomUserDetails;
import com.globify.service.RewardPointService;
import com.globify.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/rewards")
public class RewardPointController {

    private final RewardPointService rewardPointService;
    private final UserService userService;

    public RewardPointController(RewardPointService rewardPointService, UserService userService) {
        this.rewardPointService = rewardPointService;
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<RewardPointBalanceDTO> getMyPoints(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        List<RewardPointDTO> history = rewardPointService.getPointsByUser(user);
        int balance = user.getRewardPoints();
        return ResponseEntity.ok(new RewardPointBalanceDTO(balance, history));
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addPoints(@AuthenticationPrincipal CustomUserDetails userDetails,
                                          @RequestBody RewardPointRequest request) {
        User user = userDetails.getUser();
        rewardPointService.addPoints(user, request.getPoints(), request.getDescription());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/use")
    public ResponseEntity<Void> usePoints(@AuthenticationPrincipal CustomUserDetails userDetails,
                                          @RequestBody RewardPointRequest request) {
        User user = userDetails.getUser();
        rewardPointService.usePoints(user, request.getPoints(), request.getDescription());
        return ResponseEntity.ok().build();
    }
}
