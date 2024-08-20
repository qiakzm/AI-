package com.example.demo.DTO.NotificationDTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MyNotificationDTO {
    private Long id;
    private Long boardId;
    private String message;
    private LocalDateTime createdDate;
    private boolean isRead;
}
