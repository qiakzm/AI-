package com.example.demo.Controller;

import com.example.demo.Security.auth.CustomUserDetails;
import com.example.demo.Service.BoardLikeService;
import com.example.demo.entity.Board1;
import com.example.demo.entity.Board1Like;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/BoardLike")
public class BoardLikeController {
    private final BoardLikeService boardLikeService;

    @PostMapping("/SaveDelete/{boardId}")
    public Board1Like SaveAndDelete(@PathVariable Long boardId, @AuthenticationPrincipal CustomUserDetails customUserDetails){
        boardLikeService.saveLike(boardId,customUserDetails);
        return null;
    }

    @GetMapping("/{boardId}/isMyLike")
    public ResponseEntity<Boolean> isMyLike(@PathVariable Long boardId, @AuthenticationPrincipal CustomUserDetails customUserDetails){
        boolean isLiked =  boardLikeService.getIsMyLike(boardId,customUserDetails);

        return ResponseEntity.ok(isLiked);
    }

    @GetMapping("/MyPage")
    public List<Board1> getMyBoards(@AuthenticationPrincipal CustomUserDetails customUserDetails){
        List<Board1> boards = boardLikeService.getMyBoards(customUserDetails);

        if(boards.isEmpty()){
            System.out.println("좋아요 누른 게시글이 존재하지 않습니다");
            return null;
        }else{
            System.out.println("좋아요 누른 게시글 목록 확인");
            return boards;
        }

    }

}
