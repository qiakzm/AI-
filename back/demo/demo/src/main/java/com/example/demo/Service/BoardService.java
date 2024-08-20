package com.example.demo.Service;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardDTOS.BoardDetailDTO;
import com.example.demo.DTO.CommentDTOS.CommentDetailDTO;
import com.example.demo.DTO.ResponseBoardDTO;
import com.example.demo.Repository.Board1Repository;
import com.example.demo.Repository.MemberRepository;
import com.example.demo.Security.auth.CustomUserDetails;
import com.example.demo.entity.Board1;
import com.example.demo.entity.Member;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final MemberRepository memberRepository;
    private final Board1Repository board1Repository;

    public Board1 saveBoard(BoardDTO boardDTO, CustomUserDetails customUserDetails) {
        Board1 saveBoard = new Board1();
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());
        saveBoard.setMember(member);
        saveBoard.setTitle(boardDTO.getTitle());
        saveBoard.setContent(boardDTO.getContent());
        saveBoard.setCategory(boardDTO.getCategory());

        board1Repository.save(saveBoard);

        member.setPassword(null);
        member.setEmail(null);
        saveBoard.setMember(member);

        return saveBoard;
    }

    public Board1 updateBoard(Long boardId, BoardDTO boardDTO, CustomUserDetails customUserDetails) {
        Board1 board = board1Repository.findById(boardId).orElse(null);
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());
        if(board!=null){
            if(member.getUsername().equals(board.getMember().getUsername())){
                board.setTitle(boardDTO.getTitle());
                board.setContent(boardDTO.getContent());
                Board1 updatedBoard= board1Repository.save(board);
                System.out.println("성공적으로 수정되었습니다.");
                return updatedBoard;
            }else{
                System.out.println("해당 유저와 일치하지 않습니다.");
                return null;
            }
        }else{
            System.out.println("수정할 게시글이 존재하지 않습니다.");
            return null;
        }

    }

    public Board1 deleteBoard(Long boardId, CustomUserDetails customUserDetails) {
        Board1 board = board1Repository.findById(boardId).orElse(null);
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());

        if (board != null) {
            String role = member.getRole();
            if ((member.getUsername().equals(board.getMember().getUsername()))||role.equals("ROLE_ADMIN")) {
                board1Repository.deleteById(boardId);
                System.out.println("성공적으로 삭제되었습니다.");
                return board;
            } else {
                System.out.println("유저와 일치하지 않습니다");
                return null;
            }
        } else {
            System.out.println("삭제할 게시글이 존재하지 않습니다");
            return null;
        }
    }

    public List<Board1> getAllBoards() {
        List<Board1> boards = board1Repository.findAll();

        return boards;
    }

    public BoardDetailDTO findBoard(Long boardId) {
        Board1 board = board1Repository.findById(boardId).get();
        BoardDetailDTO boardDetailDTO = new BoardDetailDTO();
        boardDetailDTO.setId(board.getId());
        boardDetailDTO.setTitle(board.getTitle());
        boardDetailDTO.setContent(board.getContent());
        boardDetailDTO.setName(board.getMember().getName());
        boardDetailDTO.setCreatedDate(board.getCreatedDate());
        boardDetailDTO.setModifiedDate(board.getModifiedDate());
        boardDetailDTO.setLikes(board.getBoardlike().size());
        boardDetailDTO.setCategory(board.getCategory());

        // Convert Comment1 list to CommentDetailDTO list
        List<CommentDetailDTO> commentDTOList = board.getComments().stream()
                .map(comment -> {
                    CommentDetailDTO commentDTO = new CommentDetailDTO();
                    commentDTO.setId(comment.getId());
                    commentDTO.setCreatedDate(comment.getCreatedDate());
                    commentDTO.setModifiedDate(comment.getModifiedDate());
                    commentDTO.setAuthor(comment.getMember().getName()); // Assuming Comment1 has a member field
                    commentDTO.setContent(comment.getContent());
                    return commentDTO;
                })
                .collect(Collectors.toList());

        boardDetailDTO.setComments(commentDTOList);

        return boardDetailDTO;
    }

    public List<Board1> getMyBoards(CustomUserDetails customUserDetails) {

        System.out.println(customUserDetails.getUsername());
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());
        List<Board1> boards = board1Repository.findByMember(member);

        return boards;
    }

    public List<Board1> getTop3BoardsByLikes() {
        Pageable pageable = PageRequest.of(0, 3);
        List<Board1> top3Boards = board1Repository.findTop3ByOrderByBoardlikeCountDesc(3);

        return top3Boards;
    }

    public Page<ResponseBoardDTO> getPageBoard(String Category, int page, int size) {
        Pageable pageable = PageRequest.of(page-1, size, Sort.by(Sort.Direction.DESC, "createdDate"));
        return board1Repository.findByCategory(Category, pageable).map(board1 -> new ResponseBoardDTO(
            board1.getId(), board1.getTitle(),board1.getMember().getName(),board1.getCreatedDate(),board1.getBoardlike().size()
        ));
    }

    public boolean isMyBoard(Long boardId, CustomUserDetails customUserDetails) {
        Board1 board = board1Repository.findById(boardId).get();
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());

        return board.getMember().getId() == member.getId();

    }

    public Page<ResponseBoardDTO> getPopularPageBoard(int page, int size) {
        Pageable pageable = PageRequest.of(page-1, size, Sort.by(Sort.Direction.DESC, "createdDate"));
        return board1Repository.findByBoardlikeCountGreaterThanEqualThreeOrderByCreatedDateDesc(pageable).map(board1 -> new ResponseBoardDTO(
                board1.getId(), board1.getTitle(),board1.getMember().getName(),board1.getCreatedDate(),board1.getBoardlike().size()
        ));
    }

    public Page<ResponseBoardDTO> getBestPageBoard(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return board1Repository.findByCategoryOrderByBoardlikeCountDesc(category,pageable).map(board1 -> new ResponseBoardDTO(
                board1.getId(), board1.getTitle(),board1.getMember().getName(),board1.getCreatedDate(),board1.getBoardlike().size()
        ));
    }

    @Transactional
    public Page<ResponseBoardDTO> searchBoard(String category, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return board1Repository.findByCategoryAndKeyword(category,keyword,pageable).map(board1 -> new ResponseBoardDTO(
                board1.getId(), board1.getTitle(),board1.getMember().getName(),board1.getCreatedDate(),board1.getBoardlike().size()
        ));
    }

    public List<Board1> getRandomPopularBoards() {
        List<Board1> popularBoards = board1Repository.findPopularBoards();
        Collections.shuffle(popularBoards);
        return popularBoards.stream().limit(2).collect(Collectors.toList());
    }

    public List<Board1> getRandomStudyBoards() {

        List<Board1> studyBoards = board1Repository.findByCategory("study");
        Collections.shuffle(studyBoards);
        return studyBoards.stream().limit(2).collect(Collectors.toList());
    }
}
