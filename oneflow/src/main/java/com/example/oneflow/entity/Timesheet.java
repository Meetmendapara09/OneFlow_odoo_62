package com.example.oneflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Timesheet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Task task;

    @ManyToOne
    private User user;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Boolean billable;

    // Getters and Setters
}
