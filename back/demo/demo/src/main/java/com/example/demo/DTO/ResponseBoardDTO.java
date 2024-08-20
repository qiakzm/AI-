package com.example.demo.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ResponseBoardDTO {
    private Long id;
    private String title;
    private String author;
    private LocalDateTime createdDate;
    private int likes;

    public ResponseBoardDTO(Long id, String title, String author, LocalDateTime createdDate, int likes) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.createdDate = createdDate;
        this.likes = likes;
    }
}
