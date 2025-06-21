package com.duyhung.finance.repository;

import com.duyhung.finance.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long>, JpaSpecificationExecutor<Account> {
    List<Account> findByUserId(Long userId);
    Account findByIdAndUserId(Long accountId, Long userId);
}
