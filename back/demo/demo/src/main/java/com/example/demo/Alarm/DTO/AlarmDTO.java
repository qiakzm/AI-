package com.example.demo.Alarm.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlarmDTO {
    private String message;
    private boolean read;
    private long boardId;
}
