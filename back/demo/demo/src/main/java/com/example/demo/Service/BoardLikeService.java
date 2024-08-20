package com.example.demo.Service;

import com.example.demo.Repository.Board1LikeRepository;
import com.example.demo.Repository.Board1Repository;
import com.example.demo.Repository.MemberRepository;
import com.example.demo.Security.auth.CustomUserDetails;
import com.example.demo.entity.Board1;
import com.example.demo.entity.Board1Like;
import com.example.demo.entity.Member;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BoardLikeService {

    private final MemberRepository memberRepository;
    private final Board1Repository board1Repository;
    private final Board1LikeRepository board1LikeRepository;

    @Transactional
    public void saveLike(Long boardId, CustomUserDetails customUserDetails) {
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());
        Board1 board = board1Repository.findById(boardId).get();

        Board1Like board1Like = board1LikeRepository.findByBoard1IdAndMemberId(boardId, member.getId());
        Optional<Board1> boardOpt = board1Repository.findById(boardId);
        Optional<Member> memberOpt = memberRepository.findById(member.getId());

        if (!memberOpt.isPresent() || !boardOpt.isPresent()) {
            System.out.println("게시판이나 유저가 존재하지 않습니다.");
            return;
        }

        System.out.println(member.getUsername());

        if (board1Like != null) {
            board1LikeRepository.delete(board1Like);
            System.out.println("좋아요 취소");
        } else {
            board1Like = new Board1Like();
            board1Like.setMember(member);
            board1Like.setBoard1(board);
            board1LikeRepository.save(board1Like);
            System.out.println("좋아요 완료");
        }
    }

    public List<Board1> getMyBoards(CustomUserDetails customUserDetails) {
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());
        List<Board1> boards = board1LikeRepository.findLikedBoardsByMember(member.getId());
        return boards;
    }

    public boolean getIsMyLike(Long boardId, CustomUserDetails customUserDetails) {
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());
        Board1Like board1Like = board1LikeRepository.findByMemberIdAndBoard1Id(member.getId(), boardId);
        return board1Like != null;
    }
}
