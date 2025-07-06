package com.duyhung.finance.domain.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(name = "BudgetRequest", description = "Quoc Huy Gay")
public class ReqBudgetDTO {
    @Schema(example = "5000000")
    private Double amount;

    @Schema(example = "10000")
    private Double sentAmount;

    @Schema(example = "6")
    private Integer month;

    @Schema(example = "2025")
    private Integer year;

    @Schema(example = "{\"id\": 1}")
    private Object category;
}
