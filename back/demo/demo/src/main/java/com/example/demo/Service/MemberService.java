package com.example.demo.Service;

import com.example.demo.DTO.MemberDTO;
import com.example.demo.DTO.PasswordDTOS.FindPWDTO;
import com.example.demo.DTO.UpdatePWDTO;
import com.example.demo.Repository.MemberRepository;
import com.example.demo.Security.auth.CustomUserDetails;
import com.example.demo.Service.Redis.RedisServiceImpl;
import com.example.demo.entity.Member;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final RedisServiceImpl redisService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public ResponseEntity<String> MemberRegister(MemberDTO memberDTO) {
        String email = memberDTO.getMemberEmail();
        String authNum = memberDTO.getAuthNum();



        if(redisService.getValue(email).equals(authNum)){
            Member member = new Member();
            member.setUsername(memberDTO.getMemberUsername());
            member.setPassword(bCryptPasswordEncoder.encode(memberDTO.getMemberPassword()));
            member.setEmail(memberDTO.getMemberEmail());
            member.setName(memberDTO.getMemberName());
            member.setRole("ROLE_USER");
            member.setGrade(memberDTO.getMemberGrade());
            memberRepository.save(member);

            return ResponseEntity.ok("회원등록 완료");
        }else{

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이메일 인증이 완료되지 않는 회원");
        }


    }

    public ResponseEntity<String> updatePassword(UpdatePWDTO updatePWDTO, CustomUserDetails customUserDetails) {
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());

        String currentpw = updatePWDTO.getCurrentpassword();



        if(member!=null) {
            if (bCryptPasswordEncoder.matches(currentpw, member.getPassword())) {
                member.setPassword(bCryptPasswordEncoder.encode(updatePWDTO.getUpdatepassword()));
                memberRepository.save(member);
                System.out.println("성공적으로 비밀번호를 수정하였습니다.");
                return ResponseEntity.ok("success");
            }else{
                System.out.println("현재비밀번호와 입력비밀번호가 다릅니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("기존 비밀번호와 일치 하지 않습니다.");
            }
        }else{
            System.out.println("유저가 존재하지 않습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("there is no user");
        }

    }

    public Member MemberAdminRegister(MemberDTO memberDTO) {
        Member member = new Member();
        member.setUsername(memberDTO.getMemberUsername());
        member.setPassword(bCryptPasswordEncoder.encode(memberDTO.getMemberPassword()));
        member.setEmail(memberDTO.getMemberEmail());
        member.setName(memberDTO.getMemberName());
        member.setRole("ROLE_ADMIN");
        member.setGrade(memberDTO.getMemberGrade());
        memberRepository.save(member);

        return member;
    }

    public String findUserName(CustomUserDetails customUserDetails) {
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());

        String name = member.getName();

        return name;
    }


    public boolean existsByEmail(String email) {
        return memberRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return memberRepository.existsByUsername(username);
    }

    public ResponseEntity<String> findcheckpw(FindPWDTO findPWDTO) {
        String email = findPWDTO.getEmail();
        String authNum = findPWDTO.getAuthNum();
        String username = findPWDTO.getUsername();

        Member findmem = memberRepository.findByUsername(username);

        if(!email.equals(findmem.getEmail())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이메일과 아이디가 일치하지 않습니다.");
        }


        if(redisService.getValue(email).equals(authNum)) {
            Member member = memberRepository.findByEmail(email);
            if (member != null) {
                member.setPassword(bCryptPasswordEncoder.encode(findPWDTO.getChangepw()));
                memberRepository.save(member);
                System.out.println("성공적으로 비밀번호를 수정하였습니다.");
                return ResponseEntity.ok("success");
            } else {
                System.out.println("존재하지 않는 회원이거나 인증시간 초과");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("존재하지 않는 회원이거나 인증시간  초과");
            }
        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증번호가 일치하지 않습니다.");
        }
    }

    public ResponseEntity<String> checkcurrentpw(String currentpw, CustomUserDetails customUserDetails) {
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());

        if(member!=null) {
            if (bCryptPasswordEncoder.matches(currentpw, member.getPassword())) {

                return ResponseEntity.ok("현재 비밀번호와 일치");
            }else{
                System.out.println("현재비밀번호와 입력비밀번호가 다릅니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("기존 비밀번호와 일치 하지 않습니다.");
            }
        }else{
            System.out.println("유저가 존재하지 않습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("해당 유저가 존재하지 않습니다.");
        }

    }

    public ResponseEntity<String> checkjwt(CustomUserDetails customUserDetails) {
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());

        return ResponseEntity.ok("아직 유효한 토큰");
    }
}
