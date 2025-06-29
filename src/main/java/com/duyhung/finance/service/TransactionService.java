package com.duyhung.finance.service;

import com.duyhung.finance.domain.Account;
import com.duyhung.finance.domain.Transaction;
import com.duyhung.finance.domain.User;
import com.duyhung.finance.domain.response.ResultPaginationDTO;
import com.duyhung.finance.domain.response.account.ResCreateAccountDTO;
import com.duyhung.finance.domain.response.transaction.ResCreateTransactionDTO;
import com.duyhung.finance.repository.AccountRepository;
import com.duyhung.finance.repository.TransactionRepository;
import com.duyhung.finance.util.constant.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserService userService;

    public TransactionService(TransactionRepository transactionRepository, AccountRepository accountRepository, UserService userService) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.userService = userService;
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    @Transactional
    public ResCreateTransactionDTO createTransaction(Transaction transaction) {
        // Lấy user hiện tại
        User currentUser = userService.getCurrentUser();

        // Lấy tài khoản của người dùng
        Account account = accountRepository.findById(transaction.getAccount().getId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Kiểm tra xem tài khoản này có phải của người dùng hiện tại không
        if (account.getUser().getId() != currentUser.getId()) {  // Sử dụng so sánh trực tiếp với primitive type 'long'
            throw new RuntimeException("Account does not belong to the current user");
        }

        // Kiểm tra và trừ tiền khi giao dịch là 'EXPENSE'
        if (TransactionType.EXPENSE.equals(transaction.getType())) {
            if (account.getBalance() < transaction.getAmount()) {
                throw new RuntimeException("Insufficient balance for this transaction");
            }
            account.setBalance(account.getBalance() - transaction.getAmount());
            accountRepository.save(account);
        } else if (TransactionType.INCOME.equals(transaction.getType())) {
            account.setBalance(account.getBalance() + transaction.getAmount());
            accountRepository.save(account);
        }

        // Lưu giao dịch
        transaction.setUser(currentUser);  // Gắn người dùng hiện tại vào giao dịch
        transaction.setCreatedAt(Instant.now());

        // Lưu và tạo DTO
        Transaction savedTransaction = transactionRepository.save(transaction);

        // Chuyển đổi Transaction thành ResCreateTransactionDTO
        ResCreateTransactionDTO res = convertToResCreateTransactionDTO(savedTransaction);

        return res;
    }


    public ResCreateTransactionDTO convertToResCreateTransactionDTO(Transaction transaction) {
        ResCreateTransactionDTO res = new ResCreateTransactionDTO();
        ResCreateTransactionDTO.AccountTransaction accountTransaction = new ResCreateTransactionDTO.AccountTransaction();
        ResCreateTransactionDTO.UserTransaction userTransaction = new ResCreateTransactionDTO.UserTransaction();

        if (transaction.getAccount() != null) {
            accountTransaction.setId(transaction.getAccount().getId());
            accountTransaction.setName(transaction.getAccount().getName());
            res.setAccountTransaction(accountTransaction);
        }

        if (transaction.getUser() != null) {
            userTransaction.setId(transaction.getUser().getId());
            res.setUserTransaction(userTransaction);
        }

        res.setId(transaction.getId());
        res.setAmount(transaction.getAmount());
        res.setDescription(transaction.getDescription());
        res.setType(transaction.getType());
        res.setTransactionDate(transaction.getTransactionDate());
        res.setCreatedAt(transaction.getCreatedAt());
        res.setCategory(transaction.getCategory());

        return res;
    }


    public ResultPaginationDTO getAllTransactionsByUser(Specification<Transaction> spec, Pageable pageable) {
        User currentUser = userService.getCurrentUser();

        Specification<Transaction> userSpec = (root, query, cb) ->
                cb.equal(root.get("user").get("id"), currentUser.getId());

        Specification<Transaction> combinedSpec = spec == null ? userSpec : spec.and(userSpec);

        Page<Transaction> pageTransactions =this.transactionRepository.findAll(combinedSpec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(pageTransactions.getTotalPages());
        mt.setTotal(pageTransactions.getTotalElements());

        rs.setMeta(mt);

        //remove sensitive data
        List<ResCreateTransactionDTO> listTransactionDTOS = pageTransactions.getContent()
                .stream()
                .map(item -> this.convertToResCreateTransactionDTO(item))
                .collect(Collectors.toList());


        rs.setResult(listTransactionDTOS);

        return rs;
    }

    @Transactional
    public Transaction updateTransaction(Long id, Transaction updated) {
        User currentUser = userService.getCurrentUser();

        Transaction oldTransaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        Account account = accountRepository.findById(updated.getAccount().getId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getUser().getId() != currentUser.getId()) {
            throw new RuntimeException("Account does not belong to the current user");
        }


        if (oldTransaction.getType().equals(TransactionType.EXPENSE)) {
            account.setBalance(account.getBalance() + oldTransaction.getAmount());
        } else if (oldTransaction.getType().equals(TransactionType.INCOME)) {
            account.setBalance(account.getBalance() - oldTransaction.getAmount());
        }

        if (updated.getType().equals(TransactionType.EXPENSE)) {
            if (account.getBalance() < updated.getAmount()) {
                throw new RuntimeException("Insufficient balance for update");
            }
            account.setBalance(account.getBalance() - updated.getAmount());
        } else if (updated.getType().equals(TransactionType.INCOME)) {
            account.setBalance(account.getBalance() + updated.getAmount());
        }

        oldTransaction.setAccount(account);
        oldTransaction.setCategory(updated.getCategory());
        oldTransaction.setType(updated.getType());
        oldTransaction.setAmount(updated.getAmount());
        oldTransaction.setDescription(updated.getDescription());
        oldTransaction.setTransactionDate(updated.getTransactionDate());

        accountRepository.save(account);
        return transactionRepository.save(oldTransaction);
    }



    @Transactional
    public void deleteTransaction(Long id) {
        User currentUser = userService.getCurrentUser();

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        Account account = transaction.getAccount();

        if (account.getUser().getId() != currentUser.getId()) {
            throw new RuntimeException("Account does not belong to the current user");
        }


        if (transaction.getType().equals(TransactionType.EXPENSE)) {
            account.setBalance(account.getBalance() + transaction.getAmount());
        } else if (transaction.getType().equals(TransactionType.INCOME)) {
            account.setBalance(account.getBalance() - transaction.getAmount());
        }

        accountRepository.save(account);
        transactionRepository.deleteById(id);
    }



    public Optional<Transaction> findById(Long id) {
        return transactionRepository.findById(id);
    }

    public List<Transaction> findAllByUserId(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    public List<Transaction> findAllByAccountId(Long accountId) {
        return transactionRepository.findByAccountId(accountId);
    }

    public void deleteById(Long id) {
        transactionRepository.deleteById(id);
    }
}
