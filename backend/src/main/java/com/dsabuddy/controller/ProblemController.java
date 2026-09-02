package com.dsabuddy.controller;

import com.dsabuddy.model.Hint;
import com.dsabuddy.model.Problem;
import com.dsabuddy.model.Submission;
import com.dsabuddy.repository.ProblemRepository;
import com.dsabuddy.service.HintService;
import com.dsabuddy.service.SubmissionService;
import com.dsabuddy.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow frontend to call
public class ProblemController {

    private final ProblemRepository problemRepository;
    private final HintService hintService;
    private final SubmissionService submissionService;
    private final GeminiService geminiService;

    public ProblemController(ProblemRepository problemRepository, HintService hintService, SubmissionService submissionService, GeminiService geminiService) {
        this.problemRepository = problemRepository;
        this.hintService = hintService;
        this.submissionService = submissionService;
        this.geminiService = geminiService;
    }

    @GetMapping("/problems")
    public List<Problem> listProblems() {
        return problemRepository.findAll();
    }

    @GetMapping("/problems/{id}")
    public ResponseEntity<Problem> getProblem(@PathVariable Long id) {
        return problemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/problems")
    public Problem createProblem(@RequestBody Problem problem) {
        return problemRepository.save(problem);
    }

    @GetMapping("/problems/{id}/hints/{level}")
    public ResponseEntity<Hint> getHint(@PathVariable Long id, @PathVariable int level) {
        try {
            Hint hint = hintService.getHint(id, level);
            return ResponseEntity.ok(hint);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/submissions")
    public ResponseEntity<Submission> submitCode(@RequestBody SubmissionRequest request) {
        try {
            Submission sub = submissionService.processSubmission(
                    request.problemId(),
                    request.code(),
                    request.language(),
                    request.isCorrect()
            );
            return ResponseEntity.ok(sub);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/problems/{id}/chat")
    public ResponseEntity<Map<String, String>> chatWithTutor(@PathVariable Long id, @RequestBody ChatRequest request) {
        return problemRepository.findById(id).map(problem -> {
            String reply = geminiService.chatWithTutor(
                    problem.getTitle(),
                    problem.getDescription(),
                    request.code(),
                    request.language(),
                    request.message()
            );
            Map<String, String> response = new HashMap<>();
            response.put("reply", reply);
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }
}
