package com.duyhung.finance.service;

import com.duyhung.finance.domain.Category;
import com.duyhung.finance.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category create(Category category) {
        return categoryRepository.save(category);
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public void deleteById(Long id) {
        categoryRepository.deleteById(id);
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id).get();
    }

    public Category update(Category category) {
        return categoryRepository.save(category);
    }

    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }

    public boolean existsById(Long id) {
        return categoryRepository.existsById(id);
    }
}
