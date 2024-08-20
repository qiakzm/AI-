package com.example.demo.Controller;

import com.example.demo.DTO.SubjectDTOS.AnswerCheckRequest;
import com.example.demo.Service.SubjectService;
import com.example.demo.entity.Subject;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private static final Logger logger = LoggerFactory.getLogger(SubjectController.class);

    private final SubjectService subjectService;

    @GetMapping("/random")
    public ResponseEntity<Subject> getRandomSubject() {
        Subject subject = subjectService.getRandomSubject();
        return ResponseEntity.ok(subject);
    }

    @GetMapping("/random/{subjectName}")
    public ResponseEntity<Subject> getRandomSubjectBySubjectName(@PathVariable String subjectName) {
        Subject subject = subjectService.getRandomSubjectBySubjectName(subjectName);
        return ResponseEntity.ok(subject);
    }

    @PostMapping("/check")
    public ResponseEntity<Boolean> checkAnswer(@RequestBody AnswerCheckRequest request) {
        logger.info("Checking answer for qSub: {} with userAnswer: {}", request.getQ_sub(), request.getUserAnswer());
        boolean isCorrect = subjectService.checkAnswer(request.getQ_sub(), request.getUserAnswer());
        logger.info("Result for qSub: {} is: {}", request.getQ_sub(), isCorrect);
        return ResponseEntity.ok(isCorrect);
    }
}
