package com.duyhung.finance.controller;

import com.duyhung.finance.domain.Transaction;
import com.duyhung.finance.domain.response.ResultPaginationDTO;
import com.duyhung.finance.domain.response.transaction.ResCreateTransactionDTO;
import com.duyhung.finance.service.TransactionService;
import com.duyhung.finance.util.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v2")
public class TransactionControllerV2 {
    private final TransactionService transactionService;

    public TransactionControllerV2(TransactionService transactionService) {
        this.transactionService = transactionService;
    }




}
