package com.duyhung.finance.service;

import com.duyhung.finance.domain.Budget;
import com.duyhung.finance.domain.User;
import com.duyhung.finance.domain.response.ResultPaginationDTO;
import com.duyhung.finance.domain.response.budget.ResBudgetDTO;
import com.duyhung.finance.repository.BudgetRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserService userService;

    public BudgetService(BudgetRepository budgetRepository, UserService userService) {
        this.budgetRepository = budgetRepository;
        this.userService = userService;
    }

    public Budget createBudget(Budget budget) {
        User currentUser = userService.getCurrentUser();
        budget.setUser(currentUser);
        budget.setCreatedAt(Instant.now());
        return budgetRepository.save(budget);
    }

    public Budget getBudgetById(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
    }

    public Budget updateBudget(Long id, Budget updatedBudget) {
        Budget existingBudget = getBudgetById(id);
        User currentUser = userService.getCurrentUser();
        if (existingBudget.getUser().getId() != currentUser.getId()) {
            throw new RuntimeException("Unauthorized");
        }
        existingBudget.setAmount(updatedBudget.getAmount());
        existingBudget.setSentAmount(updatedBudget.getSentAmount());
        existingBudget.setMonth(updatedBudget.getMonth());
        existingBudget.setYear(updatedBudget.getYear());
        existingBudget.setCategory(updatedBudget.getCategory());
        return budgetRepository.save(existingBudget);
    }

    public void deleteBudgetById(Long id) {
        Budget budget = getBudgetById(id);
        User currentUser = userService.getCurrentUser();
        if (budget.getUser().getId() != currentUser.getId()) {
            throw new RuntimeException("Unauthorized");
        }
        budgetRepository.deleteById(id);
    }

    public ResultPaginationDTO getAllBudgetsByUser(Specification<Budget> spec, Pageable pageable) {
        User currentUser = userService.getCurrentUser();

        Specification<Budget> userSpec = (root, query, cb) ->
                cb.equal(root.get("user").get("id"), currentUser.getId());

        Specification<Budget> combinedSpec = spec == null ? userSpec : spec.and(userSpec);

        Page<Budget> pageBudgets = budgetRepository.findAll(combinedSpec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(pageBudgets.getTotalPages());
        mt.setTotal(pageBudgets.getTotalElements());
        rs.setMeta(mt);

        List<ResBudgetDTO> list = pageBudgets.getContent()
                .stream().map(this::convertToResBudgetDTO).collect(Collectors.toList());

        rs.setResult(list);
        return rs;
    }

    public ResBudgetDTO convertToResBudgetDTO(Budget budget) {
        ResBudgetDTO dto = new ResBudgetDTO();
        dto.setId(budget.getId());
        dto.setAmount(budget.getAmount());
        dto.setSentAmount(budget.getSentAmount());
        dto.setMonth(budget.getMonth());
        dto.setMonth(budget.getMonth());
        dto.setYear(budget.getYear());
        dto.setCreatedAt(budget.getCreatedAt());

        ResBudgetDTO.UserInfo userInfo = new ResBudgetDTO.UserInfo();
        userInfo.setId(budget.getUser().getId());
        dto.setUser(userInfo);

        ResBudgetDTO.CategoryInfo cat = new ResBudgetDTO.CategoryInfo();
        cat.setId(budget.getCategory().getId());
        cat.setName(budget.getCategory().getName());
        dto.setCategory(cat);

        return dto;
    }
}
