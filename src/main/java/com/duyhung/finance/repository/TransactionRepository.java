package com.duyhung.finance.repository;

import com.duyhung.finance.domain.DailySumDTO;
import com.duyhung.finance.domain.Transaction;
import com.duyhung.finance.util.constant.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    List<Transaction> findByUserId(Long userId);

    List<Transaction> findByAccountId(Long accountId);

//    @Query("SELECT FUNCTION('DATE', t.transactionDate) AS date, SUM(t.amount) AS total " +
//            "FROM Transaction t " +
//            "WHERE t.user.id = :userId " +
//            "AND t.transactionDate BETWEEN :startDate AND :endDate " +
//            "AND t.type = :type " +
//            "GROUP BY FUNCTION('DATE', t.transactionDate) " +
//            "ORDER BY date")
//    List<Object[]> sumAmountByDateAndType(
//            @Param("userId") Long userId,
//            @Param("startDate") Instant startDate,
//            @Param("endDate") Instant endDate,
//            @Param("type") TransactionType type
//    );
@Query("SELECT FUNCTION('DATE', t.transactionDate) AS date, SUM(t.amount) AS total " +
        "FROM Transaction t " +
        "WHERE t.user.id = :userId " +
        "AND t.transactionDate BETWEEN :startDate AND :endDate " +
        "AND t.type = :type " +
        "GROUP BY FUNCTION('DATE', t.transactionDate) " +
        "ORDER BY date")
List<Object[]> sumAmountByDateAndType(
        @Param("userId") Long userId,
        @Param("startDate") Instant startDate,
        @Param("endDate") Instant endDate,
        @Param("type") TransactionType type
);
    List<Transaction> findByUserIdAndTransactionDateBetween(Long userId, Instant from, Instant to);

    List<Transaction> findByUserIdAndTransactionDateBetween(long userId, Instant transactionDateAfter, Instant transactionDateBefore);
}
