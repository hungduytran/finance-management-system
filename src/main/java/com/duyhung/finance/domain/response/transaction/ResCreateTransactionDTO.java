package com.duyhung.finance.domain.response.transaction;

import com.duyhung.finance.domain.Account;
import com.duyhung.finance.domain.Transaction;
import com.duyhung.finance.util.constant.TransactionType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.transaction.UserTransaction;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ResCreateTransactionDTO {
    private Long id;
    private Double amount;
    private String description;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant transactionDate;

//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdAt;

    private UserTransaction userTransaction;

    private AccountTransaction accountTransaction;

    @Setter
    @Getter
    public static class UserTransaction {
        private Long id;
    }

    @Setter
    @Getter
    public static class AccountTransaction {
        private Long id;
        private String name;
    }
}