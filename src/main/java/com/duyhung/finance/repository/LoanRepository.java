package com.duyhung.finance.repository;

import com.duyhung.finance.domain.Loan;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

public interface LoanRepository extends CrudRepository<Loan, Long>, JpaSpecificationExecutor<Loan> {
}
