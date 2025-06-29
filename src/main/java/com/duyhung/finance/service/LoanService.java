package com.duyhung.finance.service;

import com.duyhung.finance.domain.Account;
import com.duyhung.finance.domain.Loan;
import com.duyhung.finance.domain.User;
import com.duyhung.finance.domain.response.ResultPaginationDTO;
import com.duyhung.finance.domain.response.account.ResCreateAccountDTO;
import com.duyhung.finance.domain.response.loan.ResCreateLoanDTO;
import com.duyhung.finance.repository.LoanRepository;
import com.duyhung.finance.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanService {
    private final LoanRepository loanRepository;
    private final UserService userService;

    public LoanService(LoanRepository loanRepository, UserService userService, UserRepository userRepository) {
        this.loanRepository = loanRepository;
        this.userService = userService;
    }

    public Loan createLoan(Loan loan) {
        User user = userService.getCurrentUser();
        loan.setUser(user);
        return loanRepository.save(loan);
    }

    public Loan getLoanById(Long id) {
        return this.loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
    }

    public ResCreateLoanDTO convertToResCreateLoanDTO(Loan loan) {
        ResCreateLoanDTO resCreateLoanDTO = new ResCreateLoanDTO();
        ResCreateLoanDTO.UserLoan userLoan = new ResCreateLoanDTO.UserLoan();

        if (loan.getUser() != null) {
            userLoan.setId(loan.getUser().getId());
            resCreateLoanDTO.setUserLoan(userLoan);
        }

        resCreateLoanDTO.setId(loan.getId());
        resCreateLoanDTO.setLenderName(loan.getLenderName());
        resCreateLoanDTO.setTotalAmount(loan.getTotalAmount());
        resCreateLoanDTO.setPaidAmount(loan.getPaidAmount());
        resCreateLoanDTO.setBorrowedDate(loan.getBorrowedDate());
        resCreateLoanDTO.setDueDate(loan.getDueDate());
        resCreateLoanDTO.setCreatedAt(loan.getCreatedAt());
        resCreateLoanDTO.setType(loan.getType());

        return resCreateLoanDTO;
    }

    public ResultPaginationDTO getAllLoansByUser(Specification<Loan> spec, Pageable pageable) {
        User currentUser = userService.getCurrentUser();

        Specification<Loan> userSpec = (root, query, cb) ->
                cb.equal(root.get("user").get("id"), currentUser.getId());

        Specification<Loan> combinedSpec = spec == null ? userSpec : spec.and(userSpec);

        Page<Loan> pageLoans = loanRepository.findAll(combinedSpec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(pageLoans.getTotalPages());
        mt.setTotal(pageLoans.getTotalElements());
        rs.setMeta(mt);

        List<ResCreateLoanDTO> listLoanDTOs = pageLoans.getContent()
                .stream()
                .map(this::convertToResCreateLoanDTO)
                .collect(Collectors.toList());

        rs.setResult(listLoanDTOs);
        return rs;
    }

    public Loan updateLoan(Loan loan) {
        return loanRepository.save(loan);
    }

    public void deleteLoanById(Long id) {
        loanRepository.deleteById(id);
    }
}
