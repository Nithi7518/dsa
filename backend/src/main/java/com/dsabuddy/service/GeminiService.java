package com.dsabuddy.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiService() {
        this.webClient = WebClient.builder().build();
    }

    public String generateHint(String problemTitle, String problemDescription, int level, List<String> previousHints) {
        String instruction = getInstructionForLevel(level);
        
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an expert DSA tutor providing Socratic hints.\n");
        prompt.append("Problem: ").append(problemTitle).append("\n");
        prompt.append("Description: ").append(problemDescription).append("\n\n");
        
        if (previousHints != null && !previousHints.isEmpty()) {
            prompt.append("Previous hints given to the student:\n");
            for (int i = 0; i < previousHints.size(); i++) {
                prompt.append("Level ").append(i + 1).append(": ").append(previousHints.get(i)).append("\n");
            }
        }
        
        prompt.append("\nInstruction for current hint (Level ").append(level).append("): ").append(instruction).append("\n");
        prompt.append("IMPORTANT: Provide ONLY the hint. Do not output the full solution code. Keep it concise.");

        return callGemini(prompt.toString());
    }

    public String generateWrongSubmissionExplanation(String problemTitle, String problemDescription, String code, String language) {
        String prompt = "You are an expert DSA tutor.\n" +
                "Problem: " + problemTitle + "\n" +
                "Description: " + problemDescription + "\n" +
                "Language: " + language + "\n" +
                "Student's Incorrect Code:\n```\n" + code + "\n```\n" +
                "The code fails to pass the tests. Please explain:\n" +
                "1. What the code currently does.\n" +
                "2. Where it likely breaks or the edge case it misses.\n" +
                "3. A guiding question for the student to figure out the fix.\n" +
                "IMPORTANT: Do NOT output the corrected code.";
        
        return callGemini(prompt);
    }

    public String chatWithTutor(String problemTitle, String problemDescription, String code, String language, String message) {
        String prompt = "You are an expert DSA tutor interacting with a student.\n" +
                "Problem: " + problemTitle + "\n" +
                "Description: " + problemDescription + "\n" +
                "Language: " + language + "\n" +
                "Student's Current Code:\n```\n" + code + "\n```\n\n" +
                "Student's Message: \"" + message + "\"\n\n" +
                "Instructions:\n" +
                "1. Answer the student's question concisely.\n" +
                "2. Provide Socratic hints or point out logical flaws without revealing the complete code solution.\n" +
                "3. If they ask for optimization, hint at the better time/space approach but let them write the code.\n" +
                "4. Keep your tone encouraging and educational.";
        
        return callGemini(prompt);
    }

    public String evaluateComplexity(String problemTitle, String code, String language) {
        String prompt = "You are an expert DSA tutor.\n" +
                "Problem: " + problemTitle + "\n" +
                "Language: " + language + "\n" +
                "Student's Correct Code:\n```\n" + code + "\n```\n\n" +
                "Analyze the time and space complexity of this code.\n" +
                "Format your response concisely, for example:\n" +
                "Time Complexity: O(N)\n" +
                "Space Complexity: O(1)\n" +
                "Briefly explain why in 1-2 sentences.";
        return callGemini(prompt);
    }

    private String getInstructionForLevel(int level) {
        return switch (level) {
            case 1 -> "Provide a guiding question to help the student understand the core requirement.";
            case 2 -> "Name the specific pattern or algorithmic approach (e.g., Sliding Window, Two Pointers) and briefly explain why it fits.";
            case 3 -> "Provide high-level pseudocode or a step-by-step logical breakdown without writing the actual code.";
            case 4 -> "Provide a detailed conceptual walkthrough of the optimal solution, but still stop short of writing the complete code.";
            default -> "Provide a helpful hint.";
        };
    }

    private String callGemini(String prompt) {
        try {
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                )
            );

            Map response = webClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    return (String) parts.get(0).get("text");
                }
            }
            return getMockedResponse(prompt);
        } catch (Exception e) {
            System.err.println("Gemini API error or restricted key detected: " + e.getMessage());
            return getMockedResponse(prompt);
        }
    }

    private String getMockedResponse(String prompt) {
        if (prompt.contains("Analyze the time and space complexity")) {
            return "Time Complexity: O(N)\nSpace Complexity: O(N)\n\n*(Note: This is a mocked evaluation because the provided Gemini API key is restricted and cannot access standard text generation models.)*";
        } else if (prompt.contains("Student's Message")) {
            return "Ah, I see you are working on this! I'd love to help, but currently, my live AI brain is in 'Mock Mode' because the provided API key does not have access to standard models.\n\nHowever, a general tip for these types of problems is to use a Hash Map or Two Pointers to optimize your solution!\n\n*(To get real answers, please use a standard `AIzaSy...` Google AI Studio key).*";
        } else {
            return "This is a mocked AI response. Please provide a standard `AIzaSy...` API key in `application.yml` for live AI tutoring.";
        }
    }
}
