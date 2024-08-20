package com.example.demo.DTO.CommentDTOS;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CommentDetailDTO {
    private Long id;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private String Author;
    private String content;
}
