package com.example.demo.entity;

import jakarta.persistence.*;

@Table(name = "table_demo")
@Entity
public class Demo {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    private String demoText;


}