package com.duyhung.finance.domain.response.budget;

import com.duyhung.finance.domain.Category;
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

    private Category category;




}
