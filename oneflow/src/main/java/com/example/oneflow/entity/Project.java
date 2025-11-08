package com.example.oneflow.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String status; // Planned, In Progress, Completed, On Hold

    @ManyToOne
    private User projectManager;

    @ManyToMany
    private List<User> teamMembers;

    private Double budget;

    // Getters and Setters
}
