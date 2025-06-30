package com.duyhung.finance.domain.response.budget;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResBudgetDTO {
    private Long id;
    private Double amount;
    private Double sentAmount;
    private Integer month;
    private Integer year;
    private Instant createdAt;

    private UserInfo user;
    private CategoryInfo category;

    @Getter
    @Setter
    public static class UserInfo {
        private Long id;
    }

    @Getter
    @Setter
    public static class CategoryInfo {
        private Long id;
        private String name;
    }
}
