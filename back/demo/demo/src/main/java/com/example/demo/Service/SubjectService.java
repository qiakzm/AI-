package com.example.demo.Service;

import com.example.demo.Repository.SubjectRepository;
import com.example.demo.entity.Subject;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public Subject getRandomSubject() {
        return subjectRepository.findRandomSubject();
    }

    public Subject getRandomSubjectBySubjectName(String subjectName) {
        return subjectRepository.findRandomSubjectBySubjectName(subjectName);
    }

    public boolean checkAnswer(String q_sub, int userAnswer) {
        Subject subject = subjectRepository.findByQSub(q_sub);
        if (subject == null) {
            throw new RuntimeException("Question not found for q_sub: " + q_sub);
        }
        return subject.getAnswer() == userAnswer;
    }
}
