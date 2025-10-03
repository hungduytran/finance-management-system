package com.duyhung.finance.domain.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(name = "AccountRequest", description = "Req")
public class ReqAccountDTO {
    @Schema(example = "ABC")
    private String name;

    @Schema(example = "Tài khoản ngân hàng")
    private String description;

    @Schema(example = "7000.0")
    private Double balance;
}
