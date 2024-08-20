package com.example.demo.Repository;

import com.example.demo.entity.Board1;
import com.example.demo.entity.Board1Like;
import com.example.demo.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Board1LikeRepository extends JpaRepository<Board1Like, Long> {
    boolean existsByBoard1IdAndMemberId(Long boardId, Long id);

    Board1Like findByBoard1IdAndMemberId(Long boardId, Long id);

    Board1Like findByMemberIdAndBoard1Id(Long memberId, Long boardId);

    @Query("SELECT b.board1 FROM Board1Like b WHERE b.member.id = :memberId")
    List<Board1> findLikedBoardsByMember(Long memberId);
}
