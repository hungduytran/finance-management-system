package com.duyhung.finance.service;

import com.duyhung.finance.domain.Account;
import com.duyhung.finance.domain.DailySumDTO;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
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

    //fetch all khong phan trang
    public List<ResCreateTransactionDTO> getAllTransactionsByUserNoPagination(Specification<Transaction> spec) {
        User currentUser = userService.getCurrentUser();

        Specification<Transaction> userSpec = (root, query, cb) ->
                cb.equal(root.get("user").get("id"), currentUser.getId());

        Specification<Transaction> combinedSpec = spec == null ? userSpec : spec.and(userSpec);

        List<Transaction> transactions = transactionRepository.findAll(combinedSpec);

        return transactions.stream()
                .map(this::convertToResCreateTransactionDTO)
                .collect(Collectors.toList());
    }


    //lay theo thang, nam
    public ResultPaginationDTO getAllTransactionsByUserAndMonthYear(
            Specification<Transaction> spec,
            Pageable pageable,
            Integer month,
            Integer year
    ) {
        User currentUser = userService.getCurrentUser();

        // Specification lọc theo user
        Specification<Transaction> userSpec = (root, query, cb) ->
                cb.equal(root.get("user").get("id"), currentUser.getId());

        // Specification lọc theo khoảng ngày trong tháng/năm
        Specification<Transaction> dateSpec = null;
        if (month != null && year != null) {
            LocalDate start = LocalDate.of(year, month, 1);
            LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

            dateSpec = (root, query, cb) ->
                    cb.between(root.get("transactionDate"), start, end);
        }

        // Gộp tất cả spec
        Specification<Transaction> combinedSpec = spec == null ? userSpec : spec.and(userSpec);
        if (dateSpec != null) {
            combinedSpec = combinedSpec.and(dateSpec);
        }

        // Truy vấn
        Page<Transaction> pageTransactions = transactionRepository.findAll(combinedSpec, pageable);

        // Gói kết quả
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();
        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(pageTransactions.getTotalPages());
        mt.setTotal(pageTransactions.getTotalElements());

        rs.setMeta(mt);

        List<ResCreateTransactionDTO> listTransactionDTOS = pageTransactions.getContent()
                .stream()
                .map(this::convertToResCreateTransactionDTO)
                .collect(Collectors.toList());

        rs.setResult(listTransactionDTOS);
        return rs;
    }

    //lay theo thang nam, khong phan trang
    public List<ResCreateTransactionDTO> getAllTransactionsByUserAndMonthYearNoPagination(
            Specification<Transaction> spec,
            Integer month,
            Integer year
    ) {
        User currentUser = userService.getCurrentUser();

        // Filter by user
        Specification<Transaction> userSpec = (root, query, cb) ->
                cb.equal(root.get("user").get("id"), currentUser.getId());

        // Filter by month/year if provided
        Specification<Transaction> dateSpec = null;
        if (month != null && year != null) {
            LocalDate start = LocalDate.of(year, month, 1);
            LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

            dateSpec = (root, query, cb) ->
                    cb.between(root.get("transactionDate"), start, end);
        }

        // Combine all specs
        Specification<Transaction> combinedSpec = spec == null ? userSpec : spec.and(userSpec);
        if (dateSpec != null) {
            combinedSpec = combinedSpec.and(dateSpec);
        }

        // Query all matching transactions
        List<Transaction> transactions = transactionRepository.findAll(combinedSpec);

        // Convert to DTOs
        return transactions.stream()
                .map(this::convertToResCreateTransactionDTO)
                .collect(Collectors.toList());
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

//    public Map<String, Object> getWeeklySummary() {
//        User currentUser = userService.getCurrentUser();
//
//        Instant now = Instant.now();
//        Instant startDate = now.minus(7, ChronoUnit.DAYS);
//
//        Map<String, Object> response = new HashMap<>();
//
//        List<Object[]> incomeData = transactionRepository.sumAmountByDateAndType(
//                currentUser.getId(), startDate, now, TransactionType.INCOME);
//
//        List<Object[]> expenseData = transactionRepository.sumAmountByDateAndType(
//                currentUser.getId(), startDate, now, TransactionType.EXPENSE);
//
//        response.put("income", convertResult(incomeData));
//        response.put("expense", convertResult(expenseData));
//
//        return response;
//    }
//
//    private Map<String, Double> convertResult(List<Object[]> rawData) {
//        Map<String, Double> result = new LinkedHashMap<>();
//        for (Object[] row : rawData) {
//            result.put(row[0].toString(), ((Number) row[1]).doubleValue());
//        }
//        return result;
//    }

    public Map<String, Object> getWeeklySummary() {
        User currentUser = userService.getCurrentUser();

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        LocalDate startDate = today.minusDays(6);

        Instant startInstant = startDate.atStartOfDay(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant();
        Instant endInstant = today.plusDays(1).atStartOfDay(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant();

        // Lấy dữ liệu từ DB
        List<Object[]> incomeRaw = transactionRepository.sumAmountByDateAndType(
                currentUser.getId(), startInstant, endInstant, TransactionType.INCOME);

        List<Object[]> expenseRaw = transactionRepository.sumAmountByDateAndType(
                currentUser.getId(), startInstant, endInstant, TransactionType.EXPENSE);

        // Chuyển dữ liệu thành Map<LocalDate, Double>
        Map<LocalDate, Double> incomeMap = convertToMap(incomeRaw);
        Map<LocalDate, Double> expenseMap = convertToMap(expenseRaw);

        List<String> labels = new ArrayList<>();
        List<Double> income = new ArrayList<>();
        List<Double> expense = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDate date = startDate.plusDays(i);
            Instant isoInstant = date.atStartOfDay(ZoneOffset.UTC).toInstant();
            labels.add(isoInstant.toString());

            income.add(incomeMap.getOrDefault(date, 0.0));
            expense.add(expenseMap.getOrDefault(date, 0.0));
        }


        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("income", income);
        result.put("expense", expense);
        return result;
    }

    private Map<LocalDate, Double> convertToMap(List<Object[]> raw) {
        Map<LocalDate, Double> map = new HashMap<>();
        for (Object[] row : raw) {
            LocalDate date = ((java.sql.Date) row[0]).toLocalDate();
            Double amount = ((Number) row[1]).doubleValue();
            map.put(date, amount);
        }
        return map;
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
