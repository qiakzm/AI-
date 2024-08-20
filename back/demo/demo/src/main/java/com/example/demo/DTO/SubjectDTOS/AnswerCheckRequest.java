package com.example.demo.DTO.SubjectDTOS;

public class AnswerCheckRequest {
    private String q_sub;
    private int userAnswer;

    // Getters and Setters
    public String getQ_sub() {
        return q_sub;
    }

    public void setQ_sub(String q_sub) {
        this.q_sub = q_sub;
    }

    public int getUserAnswer() {
        return userAnswer;
    }

    public void setUserAnswer(int userAnswer) {
        this.userAnswer = userAnswer;
    }
}
