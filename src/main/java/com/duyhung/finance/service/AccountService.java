package com.duyhung.finance.service;

import com.duyhung.finance.domain.Account;
import com.duyhung.finance.domain.Transaction;
import com.duyhung.finance.domain.User;
import com.duyhung.finance.domain.response.ResUserDTO;
import com.duyhung.finance.domain.response.ResultPaginationDTO;
import com.duyhung.finance.domain.response.account.ResCreateAccountDTO;
import com.duyhung.finance.repository.AccountRepository;
import com.duyhung.finance.repository.TransactionRepository;
import com.duyhung.finance.util.constant.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserService userService;
    private final TransactionRepository transactionRepository;

    public AccountService(AccountRepository accountRepository, UserService userService, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.userService = userService;
        this.transactionRepository = transactionRepository;
    }

    public Account createAccount(Account account) {
        // Lấy thông tin người dùng hiện tại
        User currentUser = userService.getCurrentUser();

        // Gán user cho tài khoản
        account.setUser(currentUser);

        // Lưu tài khoản vào database
        return accountRepository.save(account);
    }

    // Lấy tất cả tài khoản của người dùng hiện tại
    public List<Account> getAccountsByCurrentUser() {
        // Lấy thông tin người dùng hiện tại
        User currentUser = userService.getCurrentUser();

        // Truy vấn tất cả tài khoản của người dùng này
        return accountRepository.findByUserId(currentUser.getId());
    }

    public Optional<Account> findAccountById(Long accountId) {
        return accountRepository.findById(accountId);
    }

    public Account getAccountById(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    public ResCreateAccountDTO convertToResCreateAccountDTO(Account account) {
        ResCreateAccountDTO resCreateAccountDTO = new ResCreateAccountDTO();
        ResCreateAccountDTO.UserAccount userAccount = new ResCreateAccountDTO.UserAccount();

        if (account.getUser() != null) {
            userAccount.setId(account.getUser().getId());
            resCreateAccountDTO.setUserAccount(userAccount);
        }
        resCreateAccountDTO.setId(account.getId());
        resCreateAccountDTO.setName(account.getName());
        resCreateAccountDTO.setDescription(account.getDescription());
        resCreateAccountDTO.setBalance(account.getBalance());
        resCreateAccountDTO.setCreatedAt(account.getCreatedAt());

        return resCreateAccountDTO;
    }


    public ResultPaginationDTO getAllAccountsByUser(Specification<Account> spec, Pageable pageable) {
        // Lấy user hiện tại
        User currentUser = userService.getCurrentUser();

        // Tạo điều kiện filter theo user ID
        Specification<Account> userSpec = (root, query, cb) ->
                cb.equal(root.get("user").get("id"), currentUser.getId());

        // Kết hợp filter đầu vào với userSpec
        Specification<Account> combinedSpec = spec == null ? userSpec : spec.and(userSpec);

        // Truy vấn phân trang
        Page<Account> pageAccounts = accountRepository.findAll(combinedSpec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(pageAccounts.getTotalPages());
        mt.setTotal(pageAccounts.getTotalElements());
        rs.setMeta(mt);

        // Chuyển đổi sang DTO
        List<ResCreateAccountDTO> listAccountDTOs = pageAccounts.getContent()
                .stream()
                .map(this::convertToResCreateAccountDTO)
                .collect(Collectors.toList());

        rs.setResult(listAccountDTOs);
        return rs;
    }

    public List<ResCreateAccountDTO> getAllAccountsByUserNoPagination(Specification<Account> spec) {
        User currentUser = userService.getCurrentUser();

        Specification<Account> userSpec = (root, query, cb) ->
                cb.equal(root.get("user").get("id"), currentUser.getId());

        Specification<Account> combinedSpec = spec == null ? userSpec : spec.and(userSpec);

        List<Account> accounts = accountRepository.findAll(combinedSpec);

        return accounts.stream()
                .map(this::convertToResCreateAccountDTO)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getBalanceSummaryEvery9Days() {
        User currentUser = userService.getCurrentUser();

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(90);

        List<String> labels = new ArrayList<>();
        List<Double> balances = new ArrayList<>();

        // ✅ Tổng số dư hiện tại của tất cả các account thuộc user
        Double totalCurrentBalance = accountRepository.findByUserId(currentUser.getId())
                .stream()
                .mapToDouble(Account::getBalance)
                .sum();

        // ✅ Lấy tất cả transaction trong khoảng 90 ngày gần nhất
        List<Transaction> transactions = transactionRepository.findByUserIdAndTransactionDateBetween(
                currentUser.getId(),
                startDate.atStartOfDay(ZoneId.systemDefault()).toInstant(),
                endDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant()
        );

        // ✅ Tính các mốc thời gian 9 ngày 1 lần và cộng dồn biến động ngược lại
        List<Double> deltas = new ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(9)) {
            Instant from = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
            Instant to = date.plusDays(9).atStartOfDay(ZoneId.systemDefault()).toInstant();

            double delta = transactions.stream()
                    .filter(t -> !t.getTransactionDate().isBefore(from) && t.getTransactionDate().isBefore(to))
                    .mapToDouble(t -> t.getType() == TransactionType.INCOME ? t.getAmount() : -t.getAmount())
                    .sum();

            deltas.add(delta);
            labels.add(date.atStartOfDay(ZoneId.of("UTC")).toInstant().toString());
        }

        // ✅ Cộng từ totalCurrentBalance lùi về theo deltas để ra balance
        List<Double> reversedBalances = new ArrayList<>();
        double balance = totalCurrentBalance;
        for (int i = deltas.size() - 1; i >= 0; i--) {
            reversedBalances.add(0, balance);
            balance -= deltas.get(i);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("balances", reversedBalances);
        return result;
    }



    @Transactional
    public Account updateAccount(Long accountId, Account accountDetails) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setName(accountDetails.getName());
        account.setDescription(accountDetails.getDescription());
        account.setBalance(accountDetails.getBalance());

        return accountRepository.save(account);
    }

    @Transactional
    public void deleteAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        accountRepository.delete(account);
    }


    public Optional<Account> findById(Long id) {
        return accountRepository.findById(id);
    }

    public List<Account> findByUserId(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    public void deleteById(Long id) {
        accountRepository.deleteById(id);
    }

}
