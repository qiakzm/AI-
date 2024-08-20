package com.example.demo.Controller;

import com.example.demo.DTO.EmailRequestDTO;
import com.example.demo.DTO.MemberDTO;
import com.example.demo.DTO.MemberDetailDTOS.UserPWCheck;
import com.example.demo.DTO.PasswordDTOS.FindPWDTO;
import com.example.demo.DTO.UpdatePWDTO;
import com.example.demo.Security.auth.CustomUserDetails;
import com.example.demo.Security.jwt.JWTUtil;
import com.example.demo.Service.MemberService;
import com.example.demo.Service.Redis.RedisServiceImpl;
import com.example.demo.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Date;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/member", produces = MediaType.APPLICATION_JSON_VALUE)
public class MemberController {
    private final MemberService memberService;
    private final JWTUtil jwtUtil;
    private final RedisServiceImpl redisService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public ResponseEntity<String> Register(@RequestBody MemberDTO memberDTO){
        System.out.println(memberDTO);

        return memberService.MemberRegister(memberDTO);

    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/admin/register")
    public void AdminRegister(@RequestBody MemberDTO memberDTO){
        System.out.println(memberDTO);
        Member registermember = new Member();
        registermember = memberService.MemberAdminRegister(memberDTO);
        if(registermember != null){
            System.out.println("성공적으로 회원가입 하였습니다");

        }else{
            System.out.println("기존의 존재하는 회원이거나 회원등록양식이 잘못되었습니다.");

        }

    }


    @PutMapping("/ChangePw")
    public ResponseEntity<String> updatePassword(@RequestBody UpdatePWDTO updatePWDTO,@AuthenticationPrincipal CustomUserDetails customUserDetails ){

        return memberService.updatePassword(updatePWDTO,customUserDetails);


    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/check")
    public String checkEmail(@AuthenticationPrincipal CustomUserDetails customUserDetails){
        Member member = customUserDetails.getMember();

        return member.getRole();
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/username")
    public String getUsername(@AuthenticationPrincipal CustomUserDetails customUserDetails){
        String username = memberService.findUserName(customUserDetails);

        return username;
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmail(@PathVariable String email) {
        boolean exists = memberService.existsByEmail(email);
        System.out.println("checkemail"+exists);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<Boolean> checkUsername(@PathVariable String username) {
        boolean exists = memberService.existsByUsername(username);
        System.out.println("checkusername"+exists);
        return ResponseEntity.ok(exists);
    }

    @PostMapping("/logout")
    public  ResponseEntity<String> addToBlacklist(@RequestBody Map<String, String> request) {
        String jwt = request.get("jwt");
        if (jwt != null && jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7); // "Bearer " 제거
        } else {
            return ResponseEntity.badRequest().body("Invalid JWT token");
        }


        Date expiration = jwtUtil.getExpirationDate(jwt);
        if (expiration != null) {
            redisService.addToBlacklist(jwt, expiration);
            return ResponseEntity.ok("JWT added to blacklist");
        } else {
            return ResponseEntity.badRequest().body("Invalid JWT token");
        }
    }

    @PostMapping("/register/temp/email")
    public  ResponseEntity<String> tempRegisterEmail(@RequestBody @Valid EmailRequestDTO emailDto){
        String Email = emailDto.getEmail();

        redisService.tempRegisterEmail(Email);
        return ResponseEntity.ok("인증완료된 이메일");
    }

    @PostMapping("/register/temp/email/check")
    public ResponseEntity<String> AuthCheck(@RequestBody @Valid EmailRequestDTO emailDto) {
        String Email = emailDto.getEmail();
        Boolean checked = redisService.tempCheckEmail(Email);
        if (checked) {
            return ResponseEntity.ok("인증완료된 이메일");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증이 완료되지 않은 이메일");
        }
    }

    @PutMapping("/find/changepw")
    public ResponseEntity<String> FindCheckPW(@RequestBody FindPWDTO findPWDTO) {


        return memberService.findcheckpw(findPWDTO);

    }

    @PostMapping("/check/curretpw")
    public ResponseEntity<String> Checkcurrentpw(@RequestBody UserPWCheck userPWCheck,@AuthenticationPrincipal CustomUserDetails customUserDetails){

        return memberService.checkcurrentpw(userPWCheck.getCurrentpw(),customUserDetails);

    }

    @GetMapping("/check/jwt")
    public ResponseEntity<String> checkjwt(@AuthenticationPrincipal CustomUserDetails customUserDetails){

        return memberService.checkjwt(customUserDetails);

    }


}