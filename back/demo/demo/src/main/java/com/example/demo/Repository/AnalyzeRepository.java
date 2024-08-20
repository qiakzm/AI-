package com.example.demo.Repository;

import com.example.demo.entity.Analyze;
import com.example.demo.entity.Board1Like;
import com.example.demo.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalyzeRepository extends JpaRepository<Analyze,Long> {
    List<Analyze> findByMemberOrderByCreatedDateDesc(Member member);
}
