package com.example.oneflow.service;

import com.example.oneflow.model.Project;
import com.example.oneflow.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Optional<Project> getProjectByStringId(String id) {
        try {
            Long longId = Long.parseLong(id.replace("p", ""));
            return projectRepository.findById(longId);
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }

    public Project createProject(Project project) {
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
        
        return projectRepository.save(project);
    }

    public Optional<Project> updateProject(Long id, Project updatedProject) {
        return projectRepository.findById(id).map(existingProject -> {
            updatedProject.setId(id);
            return projectRepository.save(updatedProject);
        });
    }

    public boolean deleteProject(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
