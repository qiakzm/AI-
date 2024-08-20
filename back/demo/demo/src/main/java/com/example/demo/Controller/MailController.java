package com.example.demo.Controller;

import com.example.demo.DTO.EmailCheckDTO;
import com.example.demo.DTO.EmailRequestDTO;
import com.example.demo.Service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/Mail", produces = MediaType.APPLICATION_JSON_VALUE)
public class MailController {
    private final MailService mailService;

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/mailSend")
    public ResponseEntity<String> mailSend(@RequestBody @Valid EmailRequestDTO emailDto) {
        System.out.println("이메일 인증 요청이 들어옴");
        System.out.println("이메일 인증 이메일 :" + emailDto.getEmail());

        return mailService.joinEmail(emailDto.getEmail());

    }

    @PostMapping("/mailSend/findUsername")
    public ResponseEntity<String> FindMailSend(@RequestBody @Valid EmailRequestDTO emailDto) {
        System.out.println("아이디 찾기 이메일 들어옴");
        System.out.println("아이디 찾기 이메일 :" + emailDto.getEmail());
        boolean response = mailService.findUsernameEmail(emailDto.getEmail());
        if(response) {
            return ResponseEntity.ok("아이디 찾기 이메일 전송완료");
        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("존재하지 않는 회원입니다.");
        }
    }

    @PostMapping("/mailSend/findPassword")
    public ResponseEntity<String> FindPassWord(@RequestBody @Valid EmailRequestDTO emailDto) {
        System.out.println("비밀번호 찾기 이메일 들어옴");
        System.out.println("비밀번호 찾기 이메일 :" + emailDto.getEmail());
        boolean response = mailService.findPassword(emailDto.getEmail());
        if(response) {
            return ResponseEntity.ok("비밀번호 찾기 이메일 전송완료");
        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("존재하지 않는 회원입니다.");
        }
    }

    @PostMapping("/mailauthCheck")
    public ResponseEntity<String> AuthCheck(@RequestBody @Valid EmailCheckDTO emailCheckDto) {
        Boolean checked = mailService.CheckAuthNum(emailCheckDto.getAuthNum(), emailCheckDto.getEmail());
        if (checked) {
            return ResponseEntity.ok("인증이 완료되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증시간 만료 또는 인증번호가 틀렸습니다.");
        }
    }
}
