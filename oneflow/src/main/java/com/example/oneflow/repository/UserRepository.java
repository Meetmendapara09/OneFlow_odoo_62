package com.example.oneflow.repository;
package com.example.oneflow.entity;
import com.example.oneflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}

import jakarta.persistence.*;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String role; // Project Manager, Team Member, Admin

    // Getters and Setters
}
