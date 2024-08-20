package com.example.demo.Controller;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.CommentDTO;
import com.example.demo.DTO.CommentDTOS.MyComments;
import com.example.demo.Security.auth.CustomUserDetails;
import com.example.demo.Service.CommentService;
import com.example.demo.entity.Board1;
import com.example.demo.entity.Comment1;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/comment", produces = MediaType.APPLICATION_JSON_VALUE)
public class Comment1Controller {
    private final CommentService commentService;


    @PostMapping("/{boardId}/save") //localhost:8080/comment/{boardId}/save
    public ResponseEntity<Comment1> save(@PathVariable Long boardId, @RequestBody CommentDTO commentDTO, @AuthenticationPrincipal CustomUserDetails customUserDetails){
        Comment1 saveComment = commentService.saveComment(boardId, commentDTO,customUserDetails);



        if(saveComment!=null){
            System.out.println("성공적으로 댓글을 저장하였습니다.");
            saveComment.setMember(null);
            return ResponseEntity.ok(saveComment);
        }
        else{
            System.out.println("댓글을 저장하지 못했습니다.");
            return ResponseEntity.badRequest().body(saveComment);
        }
    }

    @PutMapping("/update/{commentId}")
    public ResponseEntity<Comment1> update(@PathVariable Long commentId, @RequestBody CommentDTO commentDTO, @AuthenticationPrincipal CustomUserDetails customUserDetails){
        Comment1 updateComment = commentService.updateComment(commentId,commentDTO,customUserDetails);

        if(updateComment!=null){
            System.out.println("성공적으로 댓글을 수정하였습니다.");
            updateComment.setMember(null);
            return ResponseEntity.ok(updateComment);
        }
        else{
            System.out.println("댓글을 수정하지 못했습니다.");
            return ResponseEntity.badRequest().body(updateComment);
        }
    }

    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<Comment1> delete(@PathVariable Long commentId, @AuthenticationPrincipal CustomUserDetails customUserDetails){
        Comment1 deleteComment =  commentService.deleteComment(commentId,customUserDetails);
        if(deleteComment!=null){
            deleteComment.setMember(null);
            return ResponseEntity.ok(deleteComment);
        }
        else{
            return ResponseEntity.badRequest().body(deleteComment);
        }
    }

    @GetMapping("/MyPage")
    public List<Board1> getMyBoards(@AuthenticationPrincipal CustomUserDetails customUserDetails){
        List<Board1> boards = commentService.getMyBoards(customUserDetails);

        if(boards.isEmpty()){
            System.out.println("댓글을 남긴 게시글이 존재하지 않습니다");
            return null;
        }else{
            System.out.println("댓글을 남긴 게시글 목록 확인");
            return boards;
        }

    }

    @GetMapping("/MyPage/MyComments")
    public List<MyComments> getMyComments(@AuthenticationPrincipal CustomUserDetails customUserDetails){
        List<MyComments> comments = commentService.getMyComments(customUserDetails);

        return comments;
    }

    @GetMapping("/{commentId}/isMyComment")
    public ResponseEntity<Boolean> isMyComment(@PathVariable Long commentId,@AuthenticationPrincipal CustomUserDetails customUserDetails){
        boolean check = commentService.isMyComment(commentId,customUserDetails);

        if(check){
            return ResponseEntity.ok(Boolean.TRUE);
        }else{
            return ResponseEntity.ok(Boolean.FALSE);
        }
    }
}
