package com.example.oneflow.model;

import java.util.List;

public class Task {
    private String id;
    private String title;
    private String description;
    private String project;
    private String projectId;
    private String assignee;
    private String assigneeAvatar;
    private String due;
    private String priority; // "Low", "Medium", "High"
    private String state; // "New", "In Progress", "Done"
    private List<String> tags;
    private SubtaskProgress subtaskProgress;

    // Inner class for subtask progress
    public static class SubtaskProgress {
        private int completed;
        private int total;

        public SubtaskProgress() {}

        public SubtaskProgress(int completed, int total) {
            this.completed = completed;
            this.total = total;
        }

        public int getCompleted() {
            return completed;
        }

        public void setCompleted(int completed) {
            this.completed = completed;
        }

        public int getTotal() {
            return total;
        }

        public void setTotal(int total) {
            this.total = total;
        }
    }

    // Constructors
    public Task() {}

    public Task(String id, String title, String description, String project, String projectId,
                String assignee, String assigneeAvatar, String due, String priority, 
                String state, List<String> tags, SubtaskProgress subtaskProgress) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.project = project;
        this.projectId = projectId;
        this.assignee = assignee;
        this.assigneeAvatar = assigneeAvatar;
        this.due = due;
        this.priority = priority;
        this.state = state;
        this.tags = tags;
        this.subtaskProgress = subtaskProgress;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getAssigneeAvatar() {
        return assigneeAvatar;
    }

    public void setAssigneeAvatar(String assigneeAvatar) {
        this.assigneeAvatar = assigneeAvatar;
    }

    public String getDue() {
        return due;
    }

    public void setDue(String due) {
        this.due = due;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public SubtaskProgress getSubtaskProgress() {
        return subtaskProgress;
    }

    public void setSubtaskProgress(SubtaskProgress subtaskProgress) {
        this.subtaskProgress = subtaskProgress;
    }
}
