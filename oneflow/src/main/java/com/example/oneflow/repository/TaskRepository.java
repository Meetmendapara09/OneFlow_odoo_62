package com.example.oneflow.repository;

import com.example.oneflow.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByAssignee(String assignee);
    List<Task> findByState(String state);
    List<Task> findByPriority(String priority);
}

