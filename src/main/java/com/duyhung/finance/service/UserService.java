package com.duyhung.finance.service;

import com.duyhung.finance.domain.User;
import com.duyhung.finance.domain.response.ResCreateUserDTO;
import com.duyhung.finance.domain.response.ResUserDTO;
import com.duyhung.finance.domain.response.ResultPaginationDTO;
import com.duyhung.finance.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public User findById(Long id) {
        Optional<User> user = this.userRepository.findById(id);
        if (user.isPresent()) {
            return user.get();
        }
        return null;
    }

    public ResultPaginationDTO findAll(Specification<User> spec, Pageable pageable) {
        Page<User> pageUsers =this.userRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(pageUsers.getTotalPages());
        mt.setTotal(pageUsers.getTotalElements());

        rs.setMeta(mt);

        //remove sensitive data
        List<ResUserDTO> listUser = pageUsers.getContent()
                .stream()
                .map(item -> this.convertToResUserDTO(item))
                .collect(Collectors.toList());


        rs.setResult(listUser);

        return rs;
    }

    public ResUserDTO convertToResUserDTO(User user) {
        ResUserDTO rs = new ResUserDTO();

        rs.setId(user.getId());
        rs.setUsername(user.getUsername());
        rs.setEmail(user.getEmail());

        return rs;
    }

    public void deleteById(Long id) {
        this.userRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return this.userRepository.existsByEmail(email);
    }

    public ResCreateUserDTO convertToResCreateDTO(User user) {
        ResCreateUserDTO res = new ResCreateUserDTO();

        res.setId(user.getId());
        res.setEmail(user.getEmail());
        res.setUsername(user.getUsername());
        res.setCreatedAt(user.getCreatedAt());
        return res;
    }
    public User findByUsername(String username) {
        return this.userRepository.findByEmail(username);
    }


    public User getuserByRefreshTokenAndEmail(String Token, String email) {
        return this.userRepository.findByRefreshTokenAndEmail(Token, email);
    }

    public void updateUserToken(String token, String email) {
        User currentUser = this.findByUsername(email);
        if (currentUser != null) {
            currentUser.setRefreshToken(token);
            this.userRepository.save(currentUser);
        }
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null) {
            String email = authentication.getName();  // Lấy email từ Authentication

            // Truy vấn User từ database bằng email
            User currentUser = userRepository.findByEmail(email); // Trả về trực tiếp đối tượng User

            if (currentUser != null) {
                return currentUser;
            } else {
                throw new RuntimeException("User not found");
            }
        }

        throw new RuntimeException("User not authenticated");
    }

}
