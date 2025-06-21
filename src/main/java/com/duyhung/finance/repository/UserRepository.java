package com.duyhung.finance.repository;

import com.duyhung.finance.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    boolean existsByEmail(String email);
    User save(User user);
    User findByEmail(String email);
    User findByRefreshTokenAndEmail(String token, String email);
    Optional<User> findByUsername(String username);

}
