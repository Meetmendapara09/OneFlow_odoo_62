package com.example.oneflow.controller;

import com.example.oneflow.model.User;
import com.example.oneflow.repository.UserRepository;
import com.example.oneflow.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody User user) {
        logger.info("🔐 Signin request received for username: {}", user.getUsername());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get user details from database to include role
        User foundUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwt = jwtUtil.generateToken(authentication);
        logger.info("✅ Signin successful for username: {}, role: {}", user.getUsername(), foundUser.getRole());

        return ResponseEntity.ok(new AuthResponse(jwt, foundUser.getUsername(), foundUser.getEmail(), foundUser.getRole().toString()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        logger.info("📝 Signup request received for username: {}, email: {}, role: {}",
                signupRequest.getUsername(), signupRequest.getEmail(), signupRequest.getRole());

        if (userRepository.findByUsername(signupRequest.getUsername()).isPresent()) {
            logger.warn("⚠️ Username already exists: {}", signupRequest.getUsername());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        // Create new user's account
        User newUser = new User();
        newUser.setUsername(signupRequest.getUsername());
        newUser.setEmail(signupRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(signupRequest.getPassword()));

        // Set role - default to TEAM_MEMBER if not specified or invalid
        if (signupRequest.getRole() != null && !signupRequest.getRole().isEmpty()) {
            try {
                newUser.setRole(User.Role.valueOf(signupRequest.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                logger.warn("⚠️ Invalid role specified: {}, using default", signupRequest.getRole());
                newUser.setRole(User.Role.TEAM_MEMBER);
            }
        } else {
            newUser.setRole(User.Role.TEAM_MEMBER);
        }

        logger.debug("💾 Saving user to database: {} with role: {}", signupRequest.getUsername(), newUser.getRole());
        User savedUser = userRepository.save(newUser);
        logger.info("✅ User saved successfully! ID: {}, Username: {}, Role: {}",
                savedUser.getId(), savedUser.getUsername(), savedUser.getRole());

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(new UserInfoResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().toString()
        ));
    }

    // Helper class for signup request
    static class SignupRequest {
        private String username;
        private String email;
        private String password;
        private String role;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    // Helper class for JSON responses
    static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    // Helper class for token responses with user info
    static class AuthResponse {
        private String token;
        private String username;
        private String email;
        private String role;

        public AuthResponse(String token, String username, String email, String role) {
            this.token = token;
            this.username = username;
            this.email = email;
            this.role = role;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    // Helper class for user info response
    static class UserInfoResponse {
        private Long id;
        private String username;
        private String email;
        private String role;

        public UserInfoResponse(Long id, String username, String email, String role) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}