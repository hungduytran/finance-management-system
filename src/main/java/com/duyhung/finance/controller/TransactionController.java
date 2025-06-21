package com.duyhung.finance.controller;

import com.duyhung.finance.domain.Account;
import com.duyhung.finance.domain.Transaction;
import com.duyhung.finance.domain.response.ResultPaginationDTO;
import com.duyhung.finance.domain.response.transaction.ResCreateTransactionDTO;
import com.duyhung.finance.service.TransactionService;
import com.duyhung.finance.util.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }


    @PostMapping("/transactions")
    @ApiMessage("Create a new transaction")
    public ResponseEntity<ResCreateTransactionDTO> createTransaction(@RequestBody Transaction transaction) {
        try {
            // Tạo giao dịch và trả về DTO
            ResCreateTransactionDTO resTransaction = transactionService.createTransaction(transaction);
            return ResponseEntity.status(HttpStatus.CREATED).body(resTransaction);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // Trả về lỗi nếu có
        }
    }

    @GetMapping("/transactions")
    @ApiMessage("fetch all transactions")
    public ResponseEntity<ResultPaginationDTO> getAllTransactions(
            @Filter Specification<Transaction> spec,
            Pageable pageable
    ) {

        return ResponseEntity.ok(this.transactionService.getAllTransactionsByUser(spec, pageable));
    }

}

