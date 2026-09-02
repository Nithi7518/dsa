package com.dsabuddy.repository;

import com.dsabuddy.model.Hint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HintRepository extends JpaRepository<Hint, Long> {
    Optional<Hint> findByProblemIdAndLevel(Long problemId, Integer level);
    List<Hint> findByProblemIdOrderByLevelAsc(Long problemId);
}
