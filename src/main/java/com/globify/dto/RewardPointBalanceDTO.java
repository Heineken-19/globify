package com.globify.dto;

import java.util.List;

public class RewardPointBalanceDTO {
    private int balance;
    private List<RewardPointDTO> history;

    public RewardPointBalanceDTO(int balance, List<RewardPointDTO> history) {
        this.balance = balance;
        this.history = history;
    }

    public int getBalance() {
        return balance;
    }

    public List<RewardPointDTO> getHistory() {
        return history;
    }
}
