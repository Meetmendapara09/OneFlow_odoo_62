package com.example.oneflow.service;

import com.example.oneflow.model.Task;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class TaskService {
    private final Map<String, Task> tasks = new ConcurrentHashMap<>();
    private final AtomicInteger idCounter = new AtomicInteger(5);

    public TaskService() {
        // Initialize with sample data
        tasks.put("t1", new Task("t1", "Design new login page", 
            "Create mockups and design system for the new login", 
            "Student Portal Revamp", "p1", "Jane", null, "2025-12-15", 
            "High", "In Progress", Arrays.asList("ui", "design"), 
            new Task.SubtaskProgress(2, 5)));
            
        tasks.put("t2", new Task("t2", "API Integration", 
            "Connect frontend with HR backend APIs", 
            "HRMS Integration", "p2", "Raj", null, "2025-12-20", 
            "Medium", "New", Arrays.asList("backend", "api"), null));
            
        tasks.put("t3", new Task("t3", "Database Schema Design", 
            "Design and implement database schema for finance module", 
            "Finance Workflows", "p3", "Sara", null, "2025-12-10", 
            "High", "Done", Arrays.asList("database", "schema"), 
            new Task.SubtaskProgress(5, 5)));
            
        tasks.put("t4", new Task("t4", "User Testing", 
            "Conduct user testing sessions with students", 
            "Student Portal Revamp", "p1", "Neil", null, "2025-12-18", 
            "Low", "New", Arrays.asList("testing", "ux"), null));
    }

    public List<Task> getAllTasks() {
        return new ArrayList<>(tasks.values());
    }

    public Optional<Task> getTaskById(String id) {
        return Optional.ofNullable(tasks.get(id));
    }

    public Task createTask(Task task) {
        String newId = "t" + idCounter.getAndIncrement();
        task.setId(newId);
        tasks.put(newId, task);
        return task;
    }

    public Optional<Task> updateTask(String id, Task updatedTask) {
        if (!tasks.containsKey(id)) {
            return Optional.empty();
        }
        
        updatedTask.setId(id);
        tasks.put(id, updatedTask);
        return Optional.of(updatedTask);
    }

    public boolean deleteTask(String id) {
        return tasks.remove(id) != null;
    }
}
