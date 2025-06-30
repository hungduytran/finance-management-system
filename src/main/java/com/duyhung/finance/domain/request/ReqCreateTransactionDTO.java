package com.duyhung.finance.domain.request;

import com.duyhung.finance.util.constant.TransactionType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Schema(name = "TransactionRequest")
public class ReqCreateTransactionDTO {

    @Schema(example = "{\"id\": 1}")
    private Object account;

    @Schema(example = "{\"id\": 1}")
    private Object category;

    @Schema(example = "INCOME")
    private TransactionType type;

    @Schema(example = "200.0")
    private Double amount;

    @Schema(example = "Mua quần áo")
    private String description;

    @Schema(example = "2025-06-27T13:55:58.454607Z")
    private Instant transactionDate;
}
