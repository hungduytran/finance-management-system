package com.duyhung.finance.controller;


import com.duyhung.finance.domain.Account;
import com.duyhung.finance.domain.User;
import com.duyhung.finance.domain.response.ResultPaginationDTO;
import com.duyhung.finance.domain.response.account.ResCreateAccountDTO;
import com.duyhung.finance.service.AccountService;
import com.duyhung.finance.util.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/accounts")
    @ApiMessage("Create a new account")
    public ResponseEntity<ResCreateAccountDTO> createAccount(@RequestBody Account account) {
        Account newAccount = accountService.createAccount(account);
        ResCreateAccountDTO resCreateAccountDTO = accountService.convertToResCreateAccountDTO(newAccount);
        return ResponseEntity.status(HttpStatus.CREATED).body(resCreateAccountDTO);
    }

//    @GetMapping("/accounts")
//    public ResponseEntity<List<ResCreateAccountDTO>> getAllAccounts() {
//        List<ResCreateAccountDTO> accounts = accountService.getAllAccountsByUser();
//
//        return ResponseEntity.ok(accounts);
//    }

//    @GetMapping("/accounts")
//    @ApiMessage("fetch all accounts")
//    public ResponseEntity<ResultPaginationDTO> getAllAccounts(
//            @Filter Specification<Account> spec,
//            Pageable pageable
//    ) {
//
//        return ResponseEntity.ok(this.accountService.getAllAccountsByUser(spec, pageable));
//    }
    @GetMapping("/accounts")
    @ApiMessage("fetch all accounts")
    public ResponseEntity<ResultPaginationDTO> getAllAccounts(
            @Filter Specification<Account> spec,
            Pageable pageable
    ) {
        return ResponseEntity.ok(this.accountService.getAllAccountsByUser(spec, pageable));
    }



    @GetMapping("/accounts/{accountId}")
    public ResponseEntity<Account> getAccountById(@PathVariable Long accountId) {
        Account account = accountService.getAccountById(accountId);
        return ResponseEntity.ok(account);
    }
}
