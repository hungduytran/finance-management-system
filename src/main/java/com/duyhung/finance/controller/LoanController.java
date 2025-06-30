package com.duyhung.finance.controller;

import com.duyhung.finance.domain.Loan;
import com.duyhung.finance.domain.Transaction;
import com.duyhung.finance.domain.request.ReqLoanDTO;
import com.duyhung.finance.domain.response.ResultPaginationDTO;
import com.duyhung.finance.domain.response.loan.ResCreateLoanDTO;
import com.duyhung.finance.service.LoanService;
import com.duyhung.finance.util.annotation.ApiMessage;
import com.duyhung.finance.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public ResponseEntity<ResCreateLoanDTO> createLoan(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Create loan body",
                    required = true,
                    content = @Content(schema = @Schema(implementation = ReqLoanDTO.class))
            )
            @RequestBody Loan loan
    ) {
        Loan newLoan = loanService.createLoan(loan);
        ResCreateLoanDTO resCreateLoanDTO = loanService.convertToResCreateLoanDTO(newLoan);
        return ResponseEntity.status(HttpStatus.CREATED).body(resCreateLoanDTO);
    }

    @GetMapping("/loans")
    @ApiMessage("fetch all loans")
//    public ResponseEntity<ResultPaginationDTO> getAllLoans(
//            @Filter Specification<Loan> spec,
//            Pageable pageable
//    ) {
//        return ResponseEntity.ok(this.loanService.getAllLoansByUser(spec, pageable));
//    }
    public ResponseEntity<List<ResCreateLoanDTO>> getAllLoansNoPagination(
            @Filter Specification<Loan> spec
    ) {
        return ResponseEntity.ok(loanService.getAllLoansByUserNoPagination(spec));
    }

    @PutMapping("/loans/{id}")
    @ApiMessage("Update a loan")
    public ResponseEntity<ResCreateLoanDTO> updateLoan(
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Update loan body",
                    required = true,
                    content = @Content(schema = @Schema(implementation = ReqLoanDTO.class))
            )
            @RequestBody Loan loanUpdate
    ) throws IdInvalidException {
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
