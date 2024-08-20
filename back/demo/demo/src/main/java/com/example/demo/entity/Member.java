package com.example.demo.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Table(name = "Member")
@Entity
@Getter
@Setter
public class Member extends Time{

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "member_id", unique = true, nullable = false)
    private Long id;


    @Column(nullable = false, unique = true,updatable = false)
    private String email;

    @Column(nullable = false, unique = true,updatable = false)
    private String username;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String grade;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Board1> board1 = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Comment1> comment1 = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Board1Like> board1Likes = new ArrayList<>();


    private String role;
}