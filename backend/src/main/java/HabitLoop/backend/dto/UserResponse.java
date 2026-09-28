package HabitLoop.backend.dto;

import HabitLoop.backend.entity.User;

/**
 * Safe user payload for API responses — never includes passwordHash.
 */
public class UserResponse {

    private Long id;
    private String name;
    private String username;
    private String email;
    private String firstName;
    private String lastName;

    public UserResponse() {
    }

    public UserResponse(User user) {
        this.id = user.getId();
        String displayName = user.getName();
        if (displayName == null || displayName.isBlank()) {
            displayName = user.getFirstName() != null ? user.getFirstName() : user.getUsername();
        }
        this.name = displayName;
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
