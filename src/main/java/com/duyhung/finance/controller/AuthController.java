package com.duyhung.finance.controller;

import com.duyhung.finance.domain.User;
import com.duyhung.finance.domain.request.ReqLoginDTO;
import com.duyhung.finance.domain.response.ResCreateUserDTO;
import com.duyhung.finance.domain.response.ResLoginDTO;
import com.duyhung.finance.service.UserService;
import com.duyhung.finance.util.SecurityUtil;
import com.duyhung.finance.util.error.IdInvalidException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final SecurityUtil securityUtil;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Value("${duyhung.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public AuthController(AuthenticationManager authenticationManager, SecurityUtil securityUtil, UserService userService, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.securityUtil = securityUtil;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // Register new user
    @PostMapping("/auth/register")
    public ResponseEntity<ResCreateUserDTO> register(@Valid @RequestBody User postManUser) throws IdInvalidException {
        if (this.userService.existsByEmail(postManUser.getEmail())) {
            throw new IdInvalidException("Email: " + postManUser.getEmail() + " already exists.");
        }

        String hashPassword = this.passwordEncoder.encode(postManUser.getPassword());
        postManUser.setPassword(hashPassword);
        User newUser = this.userService.save(postManUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.convertToResCreateDTO(newUser));
    }

    // Login user
    @PostMapping("/auth/login")
    public ResponseEntity<ResLoginDTO> login(@RequestBody ReqLoginDTO reqLoginDTO) throws IdInvalidException {
        if (!this.userService.existsByEmail(reqLoginDTO.getEmail())) {
            throw new IdInvalidException("Email " + reqLoginDTO.getEmail() + " does not exist.");
        }

        // Authenticate user with username and password
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(reqLoginDTO.getEmail(), reqLoginDTO.getPassword());

        // Perform authentication
        Authentication authentication = this.authenticationManager.authenticate(authenticationToken);


        // Set authentication context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Retrieve user details from the database
        User currentUserDB = this.userService.findByUsername(reqLoginDTO.getEmail());

        ResLoginDTO resLoginDTO = new ResLoginDTO();
        if (currentUserDB != null) {
            ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
                    currentUserDB.getId(),
                    currentUserDB.getUsername(),
                    currentUserDB.getEmail());
            resLoginDTO.setUser(userLogin);
        }

        // Generate Access Token
        String access_token = this.securityUtil.createAccessToken(authentication.getName(), resLoginDTO);
        resLoginDTO.setAccesstoken(access_token);

        // Generate Refresh Token
        String refresh_token = this.securityUtil.createRefreshToken(reqLoginDTO.getEmail(), resLoginDTO);

        // Update refresh token in the database
        this.userService.updateUserToken(refresh_token, reqLoginDTO.getEmail());

        // Set refresh token in the cookie
        ResponseCookie resCookie = ResponseCookie
                .from("refresh_token", refresh_token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookie.toString())
                .body(resLoginDTO);
    }


    // Get current user's account details
    @GetMapping("/auth/account")
    public ResponseEntity<ResLoginDTO.UserGetAccount> getAccount() {
        try {
            String email = SecurityUtil.getCurrentUserLogin()
                    .orElseThrow(() -> new IdInvalidException("User not authenticated"));

            User currentUserDB = this.userService.findByUsername(email);

            ResLoginDTO.UserGetAccount userGetAccount = new ResLoginDTO.UserGetAccount();
            if (currentUserDB != null) {
                ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin();
                userLogin.setId(currentUserDB.getId());
                userLogin.setEmail(currentUserDB.getEmail());
                userLogin.setName(currentUserDB.getUsername());

                userGetAccount.setUser(userLogin);
            }

            return ResponseEntity.ok().body(userGetAccount);
        } catch (IdInvalidException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResLoginDTO.UserGetAccount());  // Handle the exception (e.g., return a 401 Unauthorized response)
        }
    }



    // Refresh the user's access token using refresh token
    @GetMapping("/auth/refresh")
    public ResponseEntity<ResLoginDTO> getRefreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "") String refreshToken) throws IdInvalidException {

        if (refreshToken.isEmpty()) {
            throw new IdInvalidException("No refresh token found in cookies");
        }

        // Validate the refresh token
        Jwt decodedToken = this.securityUtil.checkValidRefreshToken(refreshToken);
        String email = decodedToken.getSubject();

        // Find user by email and refresh token
        User currentUser = this.userService.getuserByRefreshTokenAndEmail(refreshToken, email);
        if (currentUser == null) {
            throw new IdInvalidException("Invalid refresh token");
        }

        // Generate new access token and refresh token
        ResLoginDTO resLoginDTO = new ResLoginDTO();
        User currentUserDB = this.userService.findByUsername(email);

        if (currentUserDB != null) {
            ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
                    currentUserDB.getId(),
                    currentUserDB.getUsername(),
                    currentUserDB.getEmail());
            resLoginDTO.setUser(userLogin);
        }

        // Create a new Access Token
        String access_token = this.securityUtil.createAccessToken(email, resLoginDTO);
        resLoginDTO.setAccesstoken(access_token);

        // Create a new Refresh Token
        String new_refresh_token = this.securityUtil.createRefreshToken(email, resLoginDTO);

        // Update the refresh token in the database
        this.userService.updateUserToken(new_refresh_token, email);

        // Set new refresh token in the cookie
        ResponseCookie resCookie = ResponseCookie
                .from("refresh_token", new_refresh_token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookie.toString())
                .body(resLoginDTO);
    }


    // Logout the user and remove the refresh token
    @PostMapping("/auth/logout")
    public ResponseEntity<Void> logout() throws IdInvalidException {
        String email = SecurityUtil.getCurrentUserLogin().orElseThrow(() -> new IdInvalidException("User not authenticated"));

        this.userService.updateUserToken(null, email);

        ResponseCookie deleteCookie = ResponseCookie
                .from("refresh_token", null)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .build();
    }
}