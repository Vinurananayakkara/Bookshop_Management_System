package com.pahanaedu.billingapp.controller;

import com.pahanaedu.billingapp.dto.UserDto;
import com.pahanaedu.billingapp.model.User;
import com.pahanaedu.billingapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
public class UserRestController {

    @Autowired
    private UserService userService;

    // Get all users (Admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            List<UserDto> userDtos = users.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(userDtos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get user by ID (Admin only)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(convertToDto(user));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Helper method to convert User to UserDto
    private UserDto convertToDto(User user) {
        String role = "USER";
        if (user.getRoles() != null) {
            for (var r : user.getRoles()) {
                String roleName = r.getName();
                if (roleName != null && (roleName.equalsIgnoreCase("ROLE_ADMIN") || roleName.equalsIgnoreCase("ADMIN"))) {
                    role = "ADMIN";
                    break;
                } else if (roleName != null && (roleName.equalsIgnoreCase("ROLE_STAFF") || roleName.equalsIgnoreCase("STAFF"))) {
                    role = "STAFF";
                    break;
                }
            }
        }

        return new UserDto(
                user.getId(),
                user.getFullName() != null ? user.getFullName() : user.getUsername(),
                user.getUsername(),
                user.getEmail(),
                user.getPhone(),
                role
        );
    }
}
