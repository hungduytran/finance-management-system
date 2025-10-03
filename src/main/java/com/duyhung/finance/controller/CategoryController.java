package com.duyhung.finance.controller;

import com.duyhung.finance.domain.Category;
import com.duyhung.finance.service.CategoryService;
import com.duyhung.finance.util.annotation.ApiMessage;
import com.duyhung.finance.util.error.IdInvalidException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/categories")
    @ApiMessage("Create a new Category")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) throws IdInvalidException {
        if (categoryService.existsByName(category.getName())) {
            throw new IdInvalidException("Category name already exists");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(this.categoryService.create(category));
    }

    @GetMapping("/categories")
    @ApiMessage("Get all categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(this.categoryService.findAll());
    }

    @PutMapping("/categories")
    @ApiMessage("Update a Category")
    public ResponseEntity<Category> updateCategory(@RequestBody Category category) throws IdInvalidException {
        if (!categoryService.existsById(category.getId())) {
            throw new IdInvalidException("Category name already exists");
        }
        return ResponseEntity.ok(this.categoryService.update(category));
    }

    @DeleteMapping("/categories/{id}")
    @ApiMessage("Delete a Category")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") long id) throws IdInvalidException {
        Optional<Category> currentCategory= Optional.ofNullable(this.categoryService.findById(id));
        if (!currentCategory.isPresent()) {
            throw new IdInvalidException("Category not found");
        }
        this.categoryService.deleteById(id);
        return ResponseEntity.ok().body(null);
    }
}
