package com.example.demo.DTO.PasswordDTOS;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindPWDTO {
    private String email;
    private String username;
    private String authNum;
    private String changepw;
}
