package com.example.demo.Repository;

import com.example.demo.entity.Board1;
import com.example.demo.entity.Comment1;
import com.example.demo.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Comment1Repository extends JpaRepository<Comment1,Long> {

    List<Comment1> findByMember(Member member);
}
