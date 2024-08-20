package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "subject")
@Getter
@Setter
public class Subject {

    @Id
    @Column(name = "q_sub", unique = true, nullable = false)
    private String q_sub;

    @Column(nullable = false)
    private String question;

    @Column(nullable = false)
    private String selection;

    @Column(nullable = false)
    private String passage;

    @Column(nullable = false)
    private int answer;

    @Column(nullable = false)
    private String explanation;

    @Column(nullable = false)
    private String q_type;

    @Column(nullable = false)
    private String subject_name;
}

