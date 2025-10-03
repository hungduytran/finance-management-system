package com.duyhung.finance.controller;

import com.duyhung.finance.domain.User;
import com.duyhung.finance.domain.response.ResCreateUserDTO;
import com.duyhung.finance.domain.response.ResultPaginationDTO;
import com.duyhung.finance.service.UserService;
import com.duyhung.finance.util.annotation.ApiMessage;
import com.duyhung.finance.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/users")
    @ApiMessage("Create a new user")
    public ResponseEntity<ResCreateUserDTO> createUser(@Valid @RequestBody User user)
            throws IdInvalidException {
        boolean isEmailExist = this.userService.existsByEmail(user.getEmail());
        if (isEmailExist) {
            throw new IdInvalidException(
                    "Email: " + user.getEmail() + " da ton tai, vui long su dung email khac!");
        }
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        User currUser =  this.userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.convertToResCreateDTO(currUser));
    }

    @DeleteMapping("/users/{id}")
    @ApiMessage("Delete a user")
    public ResponseEntity<String>  deleteUser(@PathVariable("id") Long id)
            throws IdInvalidException {
        User currUser = this.userService.findById(id);
        if ( currUser == null ) {
            throw new IdInvalidException("User voi id = " + id + " khong ton tai!");
        }
        this.userService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Deleted User");
    }


    @GetMapping("/users/{id}")
    @ApiMessage("fetch user by id")
    public ResponseEntity<ResCreateUserDTO> getUserById(@PathVariable("id") Long id)
            throws IdInvalidException {
        User fetchUser = this.userService.findById(id);
        if ( fetchUser == null ) {
            throw new IdInvalidException("User id = " + id + " khong ton tai!");
        }
        return  ResponseEntity.status(HttpStatus.OK).body(this.userService.convertToResCreateDTO(fetchUser));
    }

    @GetMapping("/users")
    @ApiMessage("fetch all user")
    public ResponseEntity<ResultPaginationDTO> getAllUser(
            @Filter Specification<User> spec,
            Pageable pageable

    ) {

        return ResponseEntity.ok(this.userService.findAll(spec, pageable));
    }
}
