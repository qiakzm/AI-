package com.example.demo.DTO;

import com.example.demo.entity.Board1;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PagingResponseDTO {

    private List<ResponseBoardDTO> boards;
    private int totalPages;

}
