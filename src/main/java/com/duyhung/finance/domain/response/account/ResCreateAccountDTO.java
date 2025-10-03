package com.duyhung.finance.domain.response.account;

import com.duyhung.finance.domain.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ResCreateAccountDTO {
    private Long id;
    private User user;
    private String name;
    private String description;
    private Double balance;

//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdAt;

    private UserAccount userAccount;

    @Setter
    @Getter
    public static class UserAccount {
        private Long id;
    }
}
