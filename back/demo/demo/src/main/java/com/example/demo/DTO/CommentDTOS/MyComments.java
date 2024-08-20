package com.example.demo.DTO.CommentDTOS;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MyComments {
    private Long id;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private String boardid;
    private String boardtitle;
    private String content;
}
