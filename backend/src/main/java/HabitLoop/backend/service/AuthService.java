package HabitLoop.backend.service;

import HabitLoop.backend.dto.AuthResponse;
import HabitLoop.backend.dto.LoginRequest;
import HabitLoop.backend.dto.RegisterRequest;
import HabitLoop.backend.dto.UserResponse;
import HabitLoop.backend.entity.User;
import HabitLoop.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        String name = request.getName() != null ? request.getName().trim() : "";

        if (name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        String username = buildUniqueUsername(email);
        String passwordHash = passwordEncoder.encode(request.getPassword());

        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPasswordHash(passwordHash);
        user.setName(name);
        user.setFirstName(name);

        User saved = userRepository.save(user);
        return new AuthResponse("Registered successfully", new UserResponse(saved));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return new AuthResponse("Login successful", new UserResponse(user));
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            return "";
        }
        return email.trim().toLowerCase();
    }

    /**
     * Derive a username from the email local-part; append a number if taken.
     */
    private String buildUniqueUsername(String email) {
        String local = email.contains("@") ? email.substring(0, email.indexOf('@')) : email;
        String base = local.replaceAll("[^a-z0-9_]", "_");
        if (base.length() > 40) {
            base = base.substring(0, 40);
        }
        if (base.isBlank()) {
            base = "user";
        }

        String candidate = base;
        int suffix = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + "_" + suffix;
            suffix++;
            if (candidate.length() > 50) {
                candidate = ("u" + System.currentTimeMillis()).substring(0, 50);
                break;
            }
        }
        return candidate;
    }
}
