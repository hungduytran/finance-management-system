package com.duyhung.finance.controller;

import com.duyhung.finance.domain.Loan;
import com.duyhung.finance.domain.Transaction;
import com.duyhung.finance.domain.response.ResultPaginationDTO;
import com.duyhung.finance.domain.response.loan.ResCreateLoanDTO;
import com.duyhung.finance.service.LoanService;
import com.duyhung.finance.util.annotation.ApiMessage;
import com.duyhung.finance.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class LoanController {
    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping("/loans")
    @ApiMessage("Create a loan")
    public ResponseEntity<ResCreateLoanDTO> createLoan(@RequestBody Loan loan) {
        Loan newLoan = loanService.createLoan(loan);
        ResCreateLoanDTO resCreateLoanDTO = loanService.convertToResCreateLoanDTO(newLoan);
        return ResponseEntity.status(HttpStatus.CREATED).body(resCreateLoanDTO);
    }

    @GetMapping("/loans")
    @ApiMessage("fetch all loans")
    public ResponseEntity<ResultPaginationDTO> getAllLoans(
            @Filter Specification<Loan> spec,
            Pageable pageable
    ) {
        return ResponseEntity.ok(this.loanService.getAllLoansByUser(spec, pageable));
    }

    @PutMapping("/loans/{id}")
    @ApiMessage("Update a loan")
    public ResponseEntity<ResCreateLoanDTO> updateLoan(
            @Valid @PathVariable Long id,
            @RequestBody Loan loanUpdate)
    throws IdInvalidException {
        Optional<Loan> optionalLoan = loanService.findLoanById(id);
        if (optionalLoan.isEmpty()) {
            throw new IdInvalidException("Loan not found");
        }
        Loan updatedLoan = loanService.updateLoan(id, loanUpdate);
        ResCreateLoanDTO res = loanService.convertToResCreateLoanDTO(updatedLoan);
        return ResponseEntity.ok(res);
    }


    @DeleteMapping("/loans/{id}")
    @ApiMessage("Delete a loan")
    public ResponseEntity<Void> deleteLoan(@PathVariable("id") Long id) throws IdInvalidException {
        Optional<Loan> currentLoan = loanService.findLoanById(id);
        if (!currentLoan.isPresent()) {
            throw new IdInvalidException("Loan not found");
        }
        this.loanService.deleteLoanById(id);
        return ResponseEntity.ok().body(null);
    }

}
