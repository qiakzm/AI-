package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Table(name = "Analysis")
@Entity
@Getter
@Setter
public class Analyze extends Time{

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "analysis_id", unique = true, nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.MERGE)
    @JoinColumn(name = "member_id", updatable = false)
    @JsonIgnore
    private Member member;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false)
    private int month;

    @Column(nullable = false)
    private String subject;

    @Column
    private String type;

    @Column(nullable = false)
    private String analysisText;
}
