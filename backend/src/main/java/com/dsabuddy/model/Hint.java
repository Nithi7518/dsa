package com.dsabuddy.model;

import jakarta.persistence.*;

@Entity
@Table(name = "hints", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"problem_id", "level"})
})
public class Hint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(nullable = false)
    private Integer level;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    public Hint() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }
    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
