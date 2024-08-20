package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Table(name = "board1")
@Entity
@Getter
@Setter
public class Board1 extends Time {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "board1_id", unique = true, nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.MERGE)
    @JoinColumn(name = "member_id", updatable = false)
    @JsonIgnore
    private Member member;

    @Column(length = 100, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT",nullable = false)
    private String content;

    @Column(name = "board_category", nullable = false)
    private String category;

    @Column(name = "is_popular", nullable = false)
    private boolean isPopular;

    @OneToMany(mappedBy = "board1", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Board1Like> boardlike = new ArrayList<>();

    @OneToMany(mappedBy = "board1", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Comment1> comments = new ArrayList<>();



    private void updateIsPopular() {
        this.isPopular = this.boardlike.size() >= 5;
    }

    @PrePersist
    @PreUpdate
    private void preSave() {
        updateIsPopular();
    }
}
