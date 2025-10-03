package com.duyhung.finance.util;

import com.duyhung.finance.domain.response.ResLoginDTO;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class SecurityUtil {

    // Use HS512 from MacAlgorithm
    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;

    @Value("${duyhung.jwt.base64-secret}")
    private String jwtKey;

    @Value("${duyhung.jwt.access-token-validity-in-seconds}")
    private long accessTokenExpiration;

    @Value("${duyhung.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    // Get the secret key from base64 encoded JWT secret
    public SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(jwtKey).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, JWT_ALGORITHM.getName());
    }

    // Create claims for access token
    public JwtClaimsSet createAccessTokenClaims(String email, ResLoginDTO dto) {
        Instant now = Instant.now();
        Instant validity = now.plus(accessTokenExpiration, ChronoUnit.SECONDS);

        // Prepare user and permission claims
        ResLoginDTO.UserInsideToken userInsideToken = createUserInsideToken(dto);
        List<String> permissions = List.of("ROLE_USER_CREATE", "ROLE_USER_UPDATE");

        return JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(email)
                .claim("user", userInsideToken)
                .claim("permissions", permissions)
                .build();
    }

    // Create claims for refresh token
    public JwtClaimsSet createRefreshTokenClaims(String email, ResLoginDTO dto) {
        Instant now = Instant.now();
        Instant validity = now.plus(refreshTokenExpiration, ChronoUnit.SECONDS);

        ResLoginDTO.UserInsideToken userInsideToken = createUserInsideToken(dto);

        return JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(email)
                .claim("user", userInsideToken)
                .build();
    }

    // Helper method to create UserInsideToken object
    private ResLoginDTO.UserInsideToken createUserInsideToken(ResLoginDTO dto) {
        ResLoginDTO.UserInsideToken userInsideToken = new ResLoginDTO.UserInsideToken();
        userInsideToken.setId(dto.getUser().getId());
        userInsideToken.setEmail(dto.getUser().getEmail());
        userInsideToken.setName(dto.getUser().getName());
        return userInsideToken;
    }

    // Method to create the access token
    public String createAccessToken(String email, ResLoginDTO dto) {
        JwtClaimsSet claims = createAccessTokenClaims(email, dto);
        JwtEncoder jwtEncoder = new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
        return jwtEncoder.encode(JwtEncoderParameters.from(JwsHeader.with(JWT_ALGORITHM).build(), claims)).getTokenValue();
    }

    // Method to create the refresh token
    public String createRefreshToken(String email, ResLoginDTO dto) {
        JwtClaimsSet claims = createRefreshTokenClaims(email, dto);
        JwtEncoder jwtEncoder = new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
        return jwtEncoder.encode(JwtEncoderParameters.from(JwsHeader.with(JWT_ALGORITHM).build(), claims)).getTokenValue();
    }

    // Method to check the validity of refresh token
    public Jwt checkValidRefreshToken(String token) {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(getSecretKey())
                .macAlgorithm(JWT_ALGORITHM)
                .build();
        try {
            return jwtDecoder.decode(token);
        } catch (Exception e) {
            throw new RuntimeException("Error decoding refresh token", e);
        }
    }


    public static Optional<String> getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
    }

    private static String extractPrincipal(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserDetails springSecurityUser) {
            return springSecurityUser.getUsername();
        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        } else if (authentication.getPrincipal() instanceof String s) {
            return s;
        }
        return null;
    }

}
