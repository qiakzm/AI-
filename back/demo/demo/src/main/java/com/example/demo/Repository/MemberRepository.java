package com.example.demo.Repository;

import com.example.demo.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member,Long> {


    Member findByUsername(String username);
    Member findByEmail(String email);

    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
