package com.duyhung.finance.controller;

import com.duyhung.finance.domain.Budget;
import com.duyhung.finance.domain.request.ReqBudgetDTO;
import com.duyhung.finance.domain.response.ResultPaginationDTO;
import com.duyhung.finance.domain.response.budget.ResBudgetDTO;
import com.duyhung.finance.service.BudgetService;
import com.duyhung.finance.util.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping("/budgets")
    @ApiMessage("Create a budget")
    public ResponseEntity<ResBudgetDTO> createBudget(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Create",
                    required = true,
                    content = @Content(schema = @Schema(implementation = ReqBudgetDTO.class))
            )
            @RequestBody Budget budget
    ) {
        Budget newBudget = budgetService.createBudget(budget);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(budgetService.convertToResBudgetDTO(newBudget));
    }

    @GetMapping("/budgets")
    @ApiMessage("Fetch all budgets")
//    public ResponseEntity<ResultPaginationDTO> getAllBudgets(
//            @Filter Specification<Budget> spec,
//            Pageable pageable
//    ) {
//        return ResponseEntity.ok(budgetService.getAllBudgetsByUser(spec, pageable));
//    }
    public ResponseEntity<List<ResBudgetDTO>> getAllBudgetsNoPagination(
            @Filter Specification<Budget> spec
    ) {
        return ResponseEntity.ok(budgetService.getAllBudgetsByUserNoPagination(spec));
    }

    @PutMapping("/budgets/{id}")
    @ApiMessage("Update a budget")
    public ResponseEntity<ResBudgetDTO> updateBudget(
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Update",
                    required = true,
                    content = @Content(schema = @Schema(implementation = ReqBudgetDTO.class))
            )
            @RequestBody Budget budget
    ) {
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
