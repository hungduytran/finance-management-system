package com.duyhung.finance.service;

import com.duyhung.finance.domain.Account;
import com.duyhung.finance.domain.User;
import com.duyhung.finance.domain.response.ResUserDTO;
import com.duyhung.finance.domain.response.ResultPaginationDTO;
import com.duyhung.finance.domain.response.account.ResCreateAccountDTO;
import com.duyhung.finance.repository.AccountRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserService userService;

    public AccountService(AccountRepository accountRepository, UserService userService) {
        this.accountRepository = accountRepository;
        this.userService = userService;
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


    // Lấy tài khoản theo ID
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

//    public ResultPaginationDTO getAllAccountsByUser(Specification<Account> spec, Pageable pageable) {
//        Page<Account> pageAccounts =this.accountRepository.findAll(spec, pageable);
//        ResultPaginationDTO rs = new ResultPaginationDTO();
//        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();
//
//        mt.setPage(pageable.getPageNumber() + 1);
//        mt.setPageSize(pageable.getPageSize());
//
//        mt.setPages(pageAccounts.getTotalPages());
//        mt.setTotal(pageAccounts.getTotalElements());
//
//        rs.setMeta(mt);
//
//        //remove sensitive data
//        List<ResCreateAccountDTO> listUser = pageAccounts.getContent()
//                .stream()
//                .map(item -> this.convertToResCreateAccountDTO(item))
//                .collect(Collectors.toList());
//
//
//        rs.setResult(listUser);
//
//        return rs;
//    }

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
