package com.example.oneflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String project;

    @Column(name = "project_id")
    private Long projectId;

    @Column(nullable = false, length = 255)
    private String assignee;

    @Column(name = "assignee_avatar", length = 500)
    private String assigneeAvatar;

    @Column(name = "manager_photo", length = 500)
    private String managerPhoto;

    @Column(name = "cover_image", length = 500)
    private String coverImage;

    @Column(name = "due_date", length = 50)
    private String due;

    @Column(nullable = false, length = 20)
    private String priority; // "Low", "Medium", "High"

    @Column(nullable = false, length = 20)
    private String state; // "New", "In Progress", "Done"

    @ElementCollection
    @CollectionTable(name = "task_tags", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @Embedded
    private SubtaskProgress subtaskProgress;

    // Inner class for subtask progress
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubtaskProgress {
        private int completed;
        private int total;
    }

    // For backward compatibility with String ID in frontend
    @Transient
    public String getStringId() {
        return id != null ? "t" + id : null;
    }

    @Transient
    public String getStringProjectId() {
        return projectId != null ? "p" + projectId : null;
    }
}
