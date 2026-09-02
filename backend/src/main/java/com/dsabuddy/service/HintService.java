package com.dsabuddy.service;

import com.dsabuddy.model.Hint;
import com.dsabuddy.model.Problem;
import com.dsabuddy.repository.HintRepository;
import com.dsabuddy.repository.ProblemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HintService {

    private final HintRepository hintRepository;
    private final ProblemRepository problemRepository;
    private final GeminiService geminiService;

    public HintService(HintRepository hintRepository, ProblemRepository problemRepository, GeminiService geminiService) {
        this.hintRepository = hintRepository;
        this.problemRepository = problemRepository;
        this.geminiService = geminiService;
    }

    public Hint getHint(Long problemId, int level) {
        if (level < 1 || level > 4) {
            throw new IllegalArgumentException("Hint level must be between 1 and 4");
        }

        // Cache lookup
        Optional<Hint> existingHint = hintRepository.findByProblemIdAndLevel(problemId, level);
        if (existingHint.isPresent()) {
            return existingHint.get();
        }

        // Generate hint if not found
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found"));

        List<String> previousHints = hintRepository.findByProblemIdOrderByLevelAsc(problemId)
                .stream()
                .filter(h -> h.getLevel() < level)
                .map(Hint::getContent)
                .toList();

        String generatedContent = geminiService.generateHint(
                problem.getTitle(),
                problem.getDescription(),
                level,
                previousHints
        );

        Hint newHint = new Hint();
        newHint.setProblem(problem);
        newHint.setLevel(level);
        newHint.setContent(generatedContent);

        return hintRepository.save(newHint);
    }
}
