package com.duyhung.finance.domain.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReqLoginDTO {

    @NotBlank(message = "Username không được để trống")
    private String email;

    @NotBlank(message = "Password không được để trống")
    private String password;
}
