package com.example.oneflow.service;

import com.example.oneflow.model.Project;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ProjectService {
    private final Map<String, Project> projects = new ConcurrentHashMap<>();
    private final AtomicInteger idCounter = new AtomicInteger(3);

    public ProjectService() {
        // Initialize with sample data
        projects.put("p1", new Project("p1", "Student Portal Revamp", 
            "Revamp of the student-facing portal UI", "Jane", "In Progress", 
            35, "2025-12-31", 5, 3, 10));
        projects.put("p2", new Project("p2", "HRMS Integration", 
            "Integrate HR APIs", "Raj", "Planned", 
            10, "2026-01-15", null, null, null));
    }

    public List<Project> getAllProjects() {
        return new ArrayList<>(projects.values());
    }

    public Optional<Project> getProjectById(String id) {
        return Optional.ofNullable(projects.get(id));
    }

    public Project createProject(Project project) {
        String newId = "p" + idCounter.getAndIncrement();
        project.setId(newId);
        
        // Set defaults if not provided
        if (project.getProgress() == 0) {
            project.setProgress(0);
        }
        if (project.getTasksCompleted() == null) {
            project.setTasksCompleted(0);
        }
        if (project.getTotalTasks() == null) {
            project.setTotalTasks(0);
        }
        
        projects.put(newId, project);
        return project;
    }

    public Optional<Project> updateProject(String id, Project updatedProject) {
        if (!projects.containsKey(id)) {
            return Optional.empty();
        }
        
        updatedProject.setId(id);
        projects.put(id, updatedProject);
        return Optional.of(updatedProject);
    }

    public boolean deleteProject(String id) {
        return projects.remove(id) != null;
    }
}
