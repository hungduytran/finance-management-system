package com.duyhung.finance.repository;

import com.duyhung.finance.domain.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    // Find all transactions by user ID
    List<Transaction> findByUserId(Long userId);

    // Find all transactions by account ID
    List<Transaction> findByAccountId(Long accountId);
}
