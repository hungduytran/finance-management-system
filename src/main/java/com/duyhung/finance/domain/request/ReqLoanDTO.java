package com.duyhung.finance.domain.request;

import com.duyhung.finance.util.constant.LoanType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Schema(name = "LoanRequest", description = "Req")
public class ReqLoanDTO {
    @Schema(example = "muon 100k")
    private String lenderName;

    @Schema(example = "100000.00")
    private Double totalAmount;

    @Schema(example = "50000.00")
    private Double paidAmount;

    @Schema(example = "2025-03-03T13:55:58.454607Z")
    private Instant borrowedDate;

    @Schema(example = "2025-03-10T13:55:58.454607Z")
    private Instant dueDate;

    @Schema(example = "DEBT")
    private LoanType type;
}
