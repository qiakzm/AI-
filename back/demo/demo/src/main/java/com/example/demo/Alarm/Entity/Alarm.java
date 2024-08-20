//package com.example.demo.Alarm.Entity;
//
//import com.example.demo.entity.Board1;
//import com.example.demo.entity.Member;
//import com.example.demo.entity.Time;
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//@Entity
//@Getter
//@Setter
//public class Alarm extends Time {
//
//    @Id
//    @GeneratedValue(strategy= GenerationType.IDENTITY)
//    @Column(name = "alarm_id", unique = true, nullable = false)
//    private Long id;
//
//    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.MERGE)
//    @JoinColumn(name = "member_id", updatable = false)
//    @JsonIgnore
//    private Member member;
//
//    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.MERGE)
//    @JoinColumn(name = "board1_id", updatable = false)
//    @JsonIgnore
//    private Board1 board1;
//
//    @Column(name="alarm_message",  length = 100, nullable = false)
//    private String message;
//
//    @Column(name="alarm_read")
//    private boolean read;
//}
