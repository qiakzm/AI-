package com.example.demo.DTO.BoardDTOS;

import com.example.demo.DTO.CommentDTOS.CommentDetailDTO;
import com.example.demo.DTO.ResponseBoardDTO;
import com.example.demo.entity.Comment1;
import lombok.Getter;
import lombok.Setter;

import javax.xml.stream.events.Comment;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class BoardDetailDTO {
    private List<CommentDetailDTO> comments;
    private Long id;
    private String title;
    private String content;
    private String name;
    private String category;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private int likes;
}
