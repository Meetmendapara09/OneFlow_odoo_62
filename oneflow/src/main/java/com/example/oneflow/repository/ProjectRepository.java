package com.example.oneflow.repository;

import com.example.oneflow.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByManager(String manager);
    List<Project> findByStatus(String status);
}

