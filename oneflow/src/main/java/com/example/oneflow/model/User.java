package com.example.oneflow.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_username", columnList = "username"),
    @Index(name = "idx_email", columnList = "email")
})
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Role role = Role.TEAM_MEMBER; // Default role

    @Column(name = "hourly_rate", precision = 10, scale = 2)
    private BigDecimal hourlyRate; // For timesheet calculations

    public enum Role {
        SUPERADMIN,
        PROJECT_MANAGER,
        TEAM_MEMBER,
        SALES_FINANCE
    }
}