package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Table(name = "comment1")
@Entity
@Getter
@Setter
public class Comment1 extends Time{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "comment1_id", unique = true, nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.MERGE)
    @JoinColumn(name = "member_id", updatable = false)
    @JsonIgnore
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.MERGE)
    @JoinColumn(name = "board_id", updatable = false)
    @JsonIgnore
    private Board1 board1;

    @Column(columnDefinition = "TEXT",nullable = false)
    private String content;
}
