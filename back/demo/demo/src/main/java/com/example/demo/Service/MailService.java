package com.example.demo.Service;

import com.example.demo.Repository.MemberRepository;
import com.example.demo.Service.Redis.RedisServiceImpl;
import com.example.demo.entity.Member;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class MailService {


    private final JavaMailSender mailSender;
    private final RedisServiceImpl redisService;
    private final MemberRepository memberRepository;

    public int generateOTP(){
        java.util.Random generator = new java.util.Random();
        generator.setSeed(System.currentTimeMillis());
        return generator.nextInt(1000000) % 1000000;
    }

    public ResponseEntity<String> joinEmail(String email) {

        Member member = memberRepository.findByEmail(email);

        if(member!=null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 가입된 회원입니다");
        }

        int otp = generateOTP();
        String setFrom = "kyd2943@gmail.com"; // email-config에 설정한 자신의 이메일 주소를 입력
        String toMail = email;
        String title = "aivle_5_9_회원가입 인증"; // 이메일 제목
        String content
                = //html 형식으로 작성 !
                "<br><br>"
                        + "인증 번호는 " + otp + "입니다."
                        + "<br>"
                        + "인증번호를 제대로 입력해주세요"; //이메일 내용 삽입
        mailSend(setFrom, toMail, title, content , otp);
        return ResponseEntity.ok("인증메시지 전송완료");

    }

    public Boolean findPassword(String email) {
        Member member = memberRepository.findByEmail(email);


        if(member!=null) {
            int otp = generateOTP();
            String setFrom = "kyd2943@gmail.com"; // email-config에 설정한 자신의 이메일 주소를 입력
            String toMail = email;
            String title = "aivle_5_9_비밀번호 찾기"; // 이메일 제목
            String content
                    = //html 형식으로 작성 !
                    "<br><br>"
                            + "인증 번호는 " + otp + "입니다."
                            + "<br>"
                            + "인증번호를 제대로 입력해주세요"; //이메일 내용 삽입
            mailSend(setFrom, toMail, title, content, otp);
            return true;
        }else{
            return false;
        }

    }

    public Boolean findUsernameEmail(String email){
        Member member = memberRepository.findByEmail(email);

        System.out.println(member);

        if(member!=null) {
            String setFrom = "kyd2943@gmail.com"; // email-config에 설정한 자신의 이메일 주소를 입력
            String toMail = email;
            String title = "aivle_5_9_아이디 찾기"; // 이메일 제목
            String content
                    = //html 형식으로 작성 !
                    "<br><br>"
                            + "아이디는 " + member.getUsername() + " 입니다."
                            + "<br>";

            mailSend(setFrom, toMail, title, content);
            return true;
        }else{
            return false;
        }

    }

    //이메일을 전송합니다.
    public void mailSend(String setFrom, String toMail, String title, String content , int otp) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");

            helper.setFrom(setFrom);
            helper.setTo(toMail);
            helper.setSubject(title);
            helper.setText(content, true);

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
        redisService.setValues(toMail,Integer.toString(otp), Duration.ofSeconds(60 * 3));
    }

    //이메일을 전송합니다.
    public void mailSend(String setFrom, String toMail, String title, String content ) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");

            helper.setFrom(setFrom);
            helper.setTo(toMail);
            helper.setSubject(title);
            helper.setText(content, true);

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }


    public Boolean CheckAuthNum(String authNum, String email) {
        if(redisService.getValue(email).equals(authNum)){
            redisService.setValues(email,authNum, Duration.ofSeconds(60 * 5));
            return true;
        }else {
           return false;
        }

    }
}
