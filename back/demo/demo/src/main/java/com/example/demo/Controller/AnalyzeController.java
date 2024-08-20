package com.example.demo.Controller;

import com.example.demo.DTO.AnalyzeDTO;
import com.example.demo.Security.auth.CustomUserDetails;
import com.example.demo.Service.AnalyzeService;
import com.example.demo.entity.Analyze;
import com.example.demo.entity.Board1;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/analyze", produces = MediaType.APPLICATION_JSON_VALUE)
public class AnalyzeController {

    private final AnalyzeService analyzeService;

    @PostMapping("/save")
    public Analyze saveAnalyze(@RequestBody AnalyzeDTO analyzeDTO, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        // 인스턴스 메서드 호출
        Analyze analyze = analyzeService.saveAnalyze(analyzeDTO, customUserDetails);
        return analyze;
    }

    @GetMapping("/MyPage")
    public List<Analyze> getMyBoards(@AuthenticationPrincipal CustomUserDetails customUserDetails){
        List<Analyze> analysis = analyzeService.getMyAnalysis(customUserDetails);

        if(analysis.isEmpty()){
            System.out.println("작성게시글이 존재하지 않습니다");
            return null;
        }else{
            System.out.println("작성게시글 목록 확인");
            return analysis;
        }

    }
}
