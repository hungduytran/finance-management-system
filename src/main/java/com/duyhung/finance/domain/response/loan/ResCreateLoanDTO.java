package com.duyhung.finance.domain.response.loan;

import com.duyhung.finance.util.constant.LoanType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResCreateLoanDTO {
    private Long id;

    private String lenderName;
    private Double totalAmount;
    private Double paidAmount;

    private Date borrowedDate;
    private Date dueDate;

    @Enumerated(EnumType.STRING)
    private LoanType type; // 'debt' or 'credit'

//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdAt;

    private UserLoan userLoan;

    @Setter
    @Getter
    public static class UserLoan {
        private Long id;
    }
}
