package com.example.demo.Controller;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardDTOS.BoardDetailDTO;
import com.example.demo.DTO.PagingResponseDTO;
import com.example.demo.DTO.ResponseBoardDTO;
import com.example.demo.Security.auth.CustomUserDetails;
import com.example.demo.Service.BoardService;
import com.example.demo.entity.Board1;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/board", produces = MediaType.APPLICATION_JSON_VALUE)
public class Board1Controller {

    private final BoardService boardService;

    @GetMapping //모든 게시글 불러오기
    public List<Board1> getAllBoards(){
        List<Board1> boards = boardService.getAllBoards();
        return boards;
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<BoardDetailDTO> getBoard(@PathVariable Long boardId){
        BoardDetailDTO board = boardService.findBoard(boardId);

        if(board!=null){
            System.out.println("게시글이 존재합니다");
            return ResponseEntity.ok(board);
        }else{
            System.out.println("게시글이 존재하지 않습니다");
            return ResponseEntity.badRequest().body(board);
        }
    }

    @PostMapping("/save") //localhost:8080/board/save
    public ResponseEntity<Board1> save(@RequestBody BoardDTO boardDTO, @AuthenticationPrincipal CustomUserDetails customUserDetails){
        Board1 saveBoard = boardService.saveBoard(boardDTO,customUserDetails);



        if(saveBoard!=null){
            System.out.println("성공적으로 게시판을 저장하였습니다.");
            saveBoard.setMember(null);
            return ResponseEntity.ok(saveBoard);
        }
        else{
            System.out.println("게시판을 저장하지 못했습니다.");
            return ResponseEntity.badRequest().body(saveBoard);
        }
    }

    @PutMapping("/update/{boardId}")
    public ResponseEntity<Board1> update(@PathVariable Long boardId, @RequestBody BoardDTO boardDTO, @AuthenticationPrincipal CustomUserDetails customUserDetails){
        Board1 updateBoard = boardService.updateBoard(boardId,boardDTO,customUserDetails);

        if(updateBoard!=null){
            System.out.println("성공적으로 게시판을 수정하였습니다.");
            updateBoard.setMember(null);
            return ResponseEntity.ok(updateBoard);
        }
        else{
            System.out.println("게시판을 수정하지 못했습니다.");
            return ResponseEntity.badRequest().body(updateBoard);
        }
    }

    @DeleteMapping("/delete/{boardId}")
    public ResponseEntity<Board1> delete(@PathVariable Long boardId, @AuthenticationPrincipal CustomUserDetails customUserDetails){
        Board1 deleteBoard =  boardService.deleteBoard(boardId,customUserDetails);
        if(deleteBoard!=null){
            deleteBoard.setMember(null);
            return ResponseEntity.ok(deleteBoard);
        }
        else{
            return ResponseEntity.badRequest().body(deleteBoard);
        }
    }

    @GetMapping("/MyPage")
    public List<Board1> getMyBoards(@AuthenticationPrincipal CustomUserDetails customUserDetails){
        List<Board1> boards = boardService.getMyBoards(customUserDetails);

        if(boards.isEmpty()){
            System.out.println("작성게시글이 존재하지 않습니다");
            return null;
        }else{
            System.out.println("작성게시글 목록 확인");
            return boards;
        }

    }

    @GetMapping("/top3boards")
    public List<Board1> getTop3BoardsByLikes() {
        return boardService.getTop3BoardsByLikes();
    }

    @GetMapping("{category}/page")
    public PagingResponseDTO getPosts(@PathVariable String category,@RequestParam(defaultValue = "1") int page,
                                      @RequestParam(defaultValue = "5") int size) {
        Page<ResponseBoardDTO> pageBoard = boardService.getPageBoard(category,page,size);
        PagingResponseDTO pagingResponseDTO = new PagingResponseDTO();
        pagingResponseDTO.setBoards(pageBoard.getContent());
        pagingResponseDTO.setTotalPages(pageBoard.getTotalPages());
        return pagingResponseDTO;
    }

    @GetMapping("{category}/page/best")
    public PagingResponseDTO getBestPosts(@PathVariable String category,@RequestParam(defaultValue = "1") int page,
                                      @RequestParam(defaultValue = "5") int size) {
        Page<ResponseBoardDTO> pageBoard = boardService.getBestPageBoard(category,page,size);
        PagingResponseDTO pagingResponseDTO = new PagingResponseDTO();
        pagingResponseDTO.setBoards(pageBoard.getContent());
        pagingResponseDTO.setTotalPages(pageBoard.getTotalPages());
        return pagingResponseDTO;
    }

    @GetMapping("{category}/search")
    public PagingResponseDTO searchBoard(@PathVariable String category,@RequestParam(required = false) String keyword,@RequestParam(defaultValue = "1") int page,
                                         @RequestParam(defaultValue = "5") int size){
        Page<ResponseBoardDTO> pageBoard = boardService.searchBoard(category,keyword,page,size);
        PagingResponseDTO pagingResponseDTO = new PagingResponseDTO();
        pagingResponseDTO.setBoards(pageBoard.getContent());
        pagingResponseDTO.setTotalPages(pageBoard.getTotalPages());
        return pagingResponseDTO;
    }

    @GetMapping("/popular")
    public PagingResponseDTO getPopularPost(@RequestParam(defaultValue = "1") int page,
                                            @RequestParam(defaultValue = "5") int size){
        Page<ResponseBoardDTO> pageBoard = boardService.getPopularPageBoard(page,size);
        PagingResponseDTO pagingResponseDTO = new PagingResponseDTO();
        pagingResponseDTO.setBoards(pageBoard.getContent());
        pagingResponseDTO.setTotalPages(pageBoard.getTotalPages());
        return pagingResponseDTO;
    }

    @GetMapping("/{boardId}/isMyBoard")
    public ResponseEntity<String> isMyBoard(@PathVariable Long boardId,@AuthenticationPrincipal CustomUserDetails customUserDetails){
        boolean check = boardService.isMyBoard(boardId,customUserDetails);

        if(check){
            return ResponseEntity.ok("True");
        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("False");
        }
    }

    @GetMapping("/random-popular-boards")
    public List<Board1> getRandomPopularBoards() {
        return boardService.getRandomPopularBoards();
    }

    @GetMapping("/random-study-boards")
    public List<Board1> getRandomStudyBoards() {
        return boardService.getRandomStudyBoards();
    }
}
