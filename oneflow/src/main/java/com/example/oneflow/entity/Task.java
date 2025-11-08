package com.example.oneflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String state; // New, In Progress, Blocked, Done

    @ManyToOne
    private Project project;

    @ManyToOne
    private User assignedTo;

    private LocalDateTime dueDate;
    private Integer priority; // 1 - High, 2 - Medium, 3 - Low

    // Getters and Setters
}
