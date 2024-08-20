package com.example.demo.Service;

import com.example.demo.DTO.AnalyzeDTO;
import com.example.demo.Repository.AnalyzeRepository;
import com.example.demo.Repository.MemberRepository;
import com.example.demo.Security.auth.CustomUserDetails;
import com.example.demo.entity.Analyze;
import com.example.demo.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyzeService {

    private final MemberRepository memberRepository;
    private final AnalyzeRepository analyzeRepository;

    public Analyze saveAnalyze(AnalyzeDTO analyzeDTO, CustomUserDetails customUserDetails) {

        Member member = memberRepository.findByUsername(customUserDetails.getUsername());

        Analyze analyze = new Analyze();
        analyze.setMember(member);
        analyze.setYear(analyzeDTO.getYear());
        analyze.setMonth(analyzeDTO.getMonth());
        analyze.setSubject(analyzeDTO.getSubject());
        analyze.setType(analyzeDTO.getType());
        analyze.setAnalysisText(analyzeDTO.getAnalyze());

        analyzeRepository.save(analyze);

        return analyze;
    }

    public List<Analyze> getMyAnalysis(CustomUserDetails customUserDetails) {
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());
        List<Analyze> analysis = analyzeRepository.findByMemberOrderByCreatedDateDesc(member);

        return analysis;
    }
}
