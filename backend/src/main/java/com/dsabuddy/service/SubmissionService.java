package com.dsabuddy.service;

import com.dsabuddy.model.Problem;
import com.dsabuddy.model.Submission;
import com.dsabuddy.repository.ProblemRepository;
import com.dsabuddy.repository.SubmissionRepository;
import org.springframework.stereotype.Service;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final GeminiService geminiService;

    public SubmissionService(SubmissionRepository submissionRepository, ProblemRepository problemRepository, GeminiService geminiService) {
        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
        this.geminiService = geminiService;
    }

    public Submission processSubmission(Long problemId, String code, String language, boolean isCorrect) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found"));

        Submission submission = new Submission();
        submission.setProblem(problem);
        submission.setCode(code);
        submission.setLanguage(language);
        submission.setIsCorrect(isCorrect);

        if (!isCorrect) {
            String explanation = geminiService.generateWrongSubmissionExplanation(
                    problem.getTitle(),
                    problem.getDescription(),
                    code,
                    language
            );
            submission.setAiExplanation(explanation);
        } else {
            String complexity = geminiService.evaluateComplexity(
                    problem.getTitle(),
                    code,
                    language
            );
            submission.setAiExplanation(complexity); // Using the same field for UI simplicity
        }

        return submissionRepository.save(submission);
    }
}
