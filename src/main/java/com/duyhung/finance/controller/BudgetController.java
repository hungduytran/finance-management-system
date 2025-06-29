package com.duyhung.finance.controller;

import com.duyhung.finance.domain.Budget;
import com.duyhung.finance.domain.response.ResultPaginationDTO;
import com.duyhung.finance.domain.response.budget.ResBudgetDTO;
import com.duyhung.finance.service.BudgetService;
import com.duyhung.finance.util.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping("/budgets")
    @ApiMessage("Create a budget")
    public ResponseEntity<ResBudgetDTO> createBudget(@RequestBody Budget budget) {
        Budget newBudget = budgetService.createBudget(budget);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(budgetService.convertToResBudgetDTO(newBudget));
    }

    @GetMapping("/budgets")
    @ApiMessage("Fetch all budgets")
    public ResponseEntity<ResultPaginationDTO> getAllBudgets(
            @Filter Specification<Budget> spec,
            Pageable pageable
    ) {
        return ResponseEntity.ok(budgetService.getAllBudgetsByUser(spec, pageable));
    }

    @PutMapping("/budgets/{id}")
    @ApiMessage("Update a budget")
    public ResponseEntity<ResBudgetDTO> updateBudget(@PathVariable Long id, @RequestBody Budget budget) {
        Budget updated = budgetService.updateBudget(id, budget);
        return ResponseEntity.ok(budgetService.convertToResBudgetDTO(updated));
    }

    @DeleteMapping("/budgets/{id}")
    @ApiMessage("Delete a budget")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudgetById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
