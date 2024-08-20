package com.example.demo.DTO;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MemberDTO {


    private String memberUsername;
    private String memberPassword;
    private String memberEmail;
    private String memberName;
    private String memberGrade;
    private String authNum;
    private String roles;
}