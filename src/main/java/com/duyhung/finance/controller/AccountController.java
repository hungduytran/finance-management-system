package com.duyhung.finance.controller;


import com.duyhung.finance.domain.Account;
import com.duyhung.finance.domain.User;
import com.duyhung.finance.domain.request.ReqAccountDTO;
import com.duyhung.finance.domain.response.ResultPaginationDTO;
import com.duyhung.finance.domain.response.account.ResCreateAccountDTO;
import com.duyhung.finance.service.AccountService;
import com.duyhung.finance.util.annotation.ApiMessage;
import com.duyhung.finance.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/accounts")
    @ApiMessage("Create a new account")
    public ResponseEntity<ResCreateAccountDTO> createAccount(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dữ liệu tạo tài khoản",
                    required = true,
                    content = @Content(schema = @Schema(implementation = ReqAccountDTO.class))
            )
            @RequestBody Account account
    ) {
        Account newAccount = accountService.createAccount(account);
        ResCreateAccountDTO resCreateAccountDTO = accountService.convertToResCreateAccountDTO(newAccount);
        return ResponseEntity.status(HttpStatus.CREATED).body(resCreateAccountDTO);
    }

    @GetMapping("/accounts")
    @ApiMessage("fetch all accounts")
//    public ResponseEntity<ResultPaginationDTO> getAllAccounts(
//            @Filter Specification<Account> spec,
//            Pageable pageable
//    ) {
//        return ResponseEntity.ok(this.accountService.getAllAccountsByUser(spec, pageable));
//    }
    public ResponseEntity<List<ResCreateAccountDTO>> getAllAccountsNoPagination(
            @Filter Specification<Account> spec
    ) {
        return ResponseEntity.ok(accountService.getAllAccountsByUserNoPagination(spec));
    }


    @GetMapping("/accounts/charts")
    @ApiMessage("Total balance summary in 90 days")
    public ResponseEntity<Map<String, Object>> getAccountBalanceChart() {
        return ResponseEntity.ok(accountService.getBalanceSummaryEvery9Days());
    }


    @GetMapping("/accounts/{accountId}")
    public ResponseEntity<Account> getAccountById(@PathVariable Long accountId) {
        Account account = accountService.getAccountById(accountId);
        return ResponseEntity.ok(account);
    }

    @PutMapping("/accounts/{id}")
    @ApiMessage("Update an account")
    public ResponseEntity<ResCreateAccountDTO> updateAccount(
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dữ liệu cập nhật tài khoản",
                    required = true,
                    content = @Content(schema = @Schema(implementation = ReqAccountDTO.class))
            )
            @RequestBody Account account
    ) throws IdInvalidException {
        Optional<Account> optionalAccount = accountService.findAccountById(id);
        if (optionalAccount.isEmpty()) {
            throw new IdInvalidException("Account not found");
        }
        Account updatedAccount = accountService.updateAccount(id, account);
        ResCreateAccountDTO res = accountService.convertToResCreateAccountDTO(updatedAccount);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/accounts/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) throws IdInvalidException {
        Optional<Account> optionalAccount = this.accountService.findAccountById(id);
        if (optionalAccount.isEmpty()) {
            throw new IdInvalidException("Account not found");
        }

        this.accountService.deleteAccount(id);
        return ResponseEntity.status(HttpStatus.OK).build();

    }

}


