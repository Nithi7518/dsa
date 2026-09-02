package com.dsabuddy;

import com.dsabuddy.model.Problem;
import com.dsabuddy.repository.ProblemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepository;

    public DataSeeder(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (problemRepository.count() == 0) {
            System.out.println("Seeding database with initial problems...");

            Problem p1 = new Problem();
            p1.setTitle("Two Sum");
            p1.setSlug("two-sum");
            p1.setDescription("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.");
            p1.setDifficulty(Problem.Difficulty.EASY);
            p1.setLeetCodeUrl("https://leetcode.com/problems/two-sum/");
            p1.setTags(List.of("Array", "Hash Table"));

            Problem p2 = new Problem();
            p2.setTitle("Longest Substring Without Repeating Characters");
            p2.setSlug("longest-substring-without-repeating-characters");
            p2.setDescription("Given a string s, find the length of the longest substring without repeating characters.");
            p2.setDifficulty(Problem.Difficulty.MEDIUM);
            p2.setLeetCodeUrl("https://leetcode.com/problems/longest-substring-without-repeating-characters/");
            p2.setTags(List.of("Hash Table", "String", "Sliding Window"));

            Problem p3 = new Problem();
            p3.setTitle("Trapping Rain Water");
            p3.setSlug("trapping-rain-water");
            p3.setDescription("Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.");
            p3.setDifficulty(Problem.Difficulty.HARD);
            p3.setLeetCodeUrl("https://leetcode.com/problems/trapping-rain-water/");
            p3.setTags(List.of("Array", "Two Pointers", "Dynamic Programming", "Stack"));

            Problem p4 = new Problem();
            p4.setTitle("Valid Parentheses");
            p4.setSlug("valid-parentheses");
            p4.setDescription("Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.");
            p4.setDifficulty(Problem.Difficulty.EASY);
            p4.setLeetCodeUrl("https://leetcode.com/problems/valid-parentheses/");
            p4.setTags(List.of("String", "Stack"));

            Problem p5 = new Problem();
            p5.setTitle("Merge Intervals");
            p5.setSlug("merge-intervals");
            p5.setDescription("Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.");
            p5.setDifficulty(Problem.Difficulty.MEDIUM);
            p5.setLeetCodeUrl("https://leetcode.com/problems/merge-intervals/");
            p5.setTags(List.of("Array", "Sorting"));

            Problem p6 = new Problem();
            p6.setTitle("Word Search");
            p6.setSlug("word-search");
            p6.setDescription("Given an m x n grid of characters board and a string word, return true if word exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.");
            p6.setDifficulty(Problem.Difficulty.MEDIUM);
            p6.setLeetCodeUrl("https://leetcode.com/problems/word-search/");
            p6.setTags(List.of("Array", "Backtracking", "Matrix"));

            problemRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6));
            System.out.println("Seeding complete!");
        }
    }
}
