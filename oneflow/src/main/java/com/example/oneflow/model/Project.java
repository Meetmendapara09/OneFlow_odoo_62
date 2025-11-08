package com.example.oneflow.model;

public class Project {
    private String id;
    private String name;
    private String description;
    private String manager;
    private String status; // "Planned", "In Progress", "Completed", "On Hold"
    private int progress;
    private String deadline;
    private Integer teamSize;
    private Integer tasksCompleted;
    private Integer totalTasks;

    // Constructors
    public Project() {}

    public Project(String id, String name, String description, String manager, 
                   String status, int progress, String deadline, Integer teamSize,
                   Integer tasksCompleted, Integer totalTasks) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.manager = manager;
        this.status = status;
        this.progress = progress;
        this.deadline = deadline;
        this.teamSize = teamSize;
        this.tasksCompleted = tasksCompleted;
        this.totalTasks = totalTasks;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public Integer getTeamSize() {
        return teamSize;
    }

    public void setTeamSize(Integer teamSize) {
        this.teamSize = teamSize;
    }

    public Integer getTasksCompleted() {
        return tasksCompleted;
    }

    public void setTasksCompleted(Integer tasksCompleted) {
        this.tasksCompleted = tasksCompleted;
    }

    public Integer getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(Integer totalTasks) {
        this.totalTasks = totalTasks;
    }
}
