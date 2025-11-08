package com.example.oneflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 255)
    private String manager;

    @Column(name = "manager_photo", length = 500)
    private String managerPhoto;

    @Column(nullable = false, length = 50)
    private String status; // "Planned", "In Progress", "Completed", "On Hold"

    @Column(nullable = false, length = 20)
    private String priority; // "Low", "Medium", "High", "Critical"

    @Column(name = "cover_image", length = 500)
    private String coverImage;

    @Column(nullable = false)
    private int progress;

    @Column(length = 50)
    private String deadline;

    @Column(name = "team_size")
    private Integer teamSize;

    @Column(name = "tasks_completed")
    private Integer tasksCompleted;

    @Column(name = "total_tasks")
    private Integer totalTasks;

    // For backward compatibility with String ID in frontend
    @Transient
    public String getStringId() {
        return id != null ? "p" + id : null;
    }
}
