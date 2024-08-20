package com.example.demo.Service;

import com.example.demo.DTO.CommentDTO;
import com.example.demo.DTO.CommentDTOS.MyComments;
import com.example.demo.Repository.Board1Repository;
import com.example.demo.Repository.Comment1Repository;
import com.example.demo.Repository.MemberRepository;
import com.example.demo.Security.auth.CustomUserDetails;
import com.example.demo.entity.Board1;
import com.example.demo.entity.Comment1;
import com.example.demo.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final MemberRepository memberRepository;
    private final Board1Repository board1Repository;
    private final Comment1Repository comment1Repository;
    private final NotificationService notificationService;

    public Comment1 saveComment(Long boardId, CommentDTO commentDTO, CustomUserDetails customUserDetails) {

        Comment1 comment = new Comment1();
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());
        Board1 board = board1Repository.findById(boardId).orElse(null);
        if(member==null){
            System.out.println("유저가 존재하지 않습니다.");
            return null;
        }

        if(board==null){
            System.out.println("게시판이 존재하지 않습니다");
            return null;
        }


        comment.setMember(member);
        comment.setBoard1(board);
        comment.setContent(commentDTO.getContent());

        comment1Repository.save(comment);

        //게시판 작성자 알림 보내기
        Member boardAuthor = board.getMember();
        if(boardAuthor.getId()!= member.getId()) {
            String message = member.getName() + "님이 게시글에 댓글을 남겼습니다.";
            notificationService.sendNotification(boardAuthor.getId(), message,boardId);
        }
        return comment;
    }

    public Comment1 updateComment(Long commentId, CommentDTO commentDTO, CustomUserDetails customUserDetails) {
        Comment1 comment1 = comment1Repository.findById(commentId).orElse(null);
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());

        if(member==null){
            System.out.println("유저가 존재하지 않습니다.");
            return null;
        }


        if(comment1!=null){
            if(member.getUsername().equals(comment1.getMember().getUsername())){
                comment1.setContent(commentDTO.getContent());
                Comment1 updatedComment= comment1Repository.save(comment1);
                System.out.println("성공적으로 댓글이 수정되었습니다.");
                return updatedComment;
            }else{
                System.out.println("해당 유저와 일치하지 않습니다.");
                return null;
            }
        }else{
            System.out.println("수정할 댓글이 존재하지 않습니다.");
            return null;
        }
    }


    public Comment1 deleteComment(Long commentId, CustomUserDetails customUserDetails) {
        Comment1 comment = comment1Repository.findById(commentId).orElse(null);
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());
        if (comment != null) {
            String role = member.getRole();
            if ((member.getUsername().equals(comment.getMember().getUsername()))||role.equals("ROLE_ADMIN")) {
                comment1Repository.deleteById(commentId);
                System.out.println("성공적으로 삭제되었습니다.");
                return comment;
            } else {
                System.out.println("유저와 일치하지 않습니다");
                return null;
            }
        } else {
            System.out.println("삭제할 댓글이 존재하지 않습니다");
            return null;
        }
    }

    public List<Board1> getMyBoards(CustomUserDetails customUserDetails) {
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());
        List<Board1> board = board1Repository.findByMember(member);

        return board;
    }

    public boolean isMyComment(Long commentId, CustomUserDetails customUserDetails) {
        Comment1 comment = comment1Repository.findById(commentId).get();
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());

        return comment.getMember().getId() == member.getId();
    }

    public List<MyComments> getMyComments(CustomUserDetails customUserDetails) {
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());

        List<Comment1> comments = comment1Repository.findByMember(member);

        return comments.stream()
                .map(comment -> {
                    MyComments myComment = new MyComments();
                    myComment.setId(comment.getId());
                    myComment.setCreatedDate(comment.getCreatedDate());
                    myComment.setModifiedDate(comment.getModifiedDate());
                    myComment.setBoardid(comment.getBoard1().getId().toString()); // Assuming Comment1 has a getBoard method
                    myComment.setBoardtitle(comment.getBoard1().getTitle()); // Assuming Comment1 has a getBoard method
                    myComment.setContent(comment.getContent());
                    return myComment;
                })
                .collect(Collectors.toList());

    }
}
