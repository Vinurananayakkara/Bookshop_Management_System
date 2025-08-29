package com.pahanaedu.billingapp.controller;

import com.pahanaedu.billingapp.dto.PasswordChangeDTO;
import com.pahanaedu.billingapp.dto.UserProfileDTO;
import com.pahanaedu.billingapp.model.User;
import com.pahanaedu.billingapp.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@Tag(name = "User Profile API", description = "Manage user profile information")
public class UserProfileRestController {

    @Autowired
    private UserService userService;

    @GetMapping
    @Operation(summary = "Get current user's profile")
    public ResponseEntity<UserProfileDTO> getCurrentUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserProfileDTO profileDTO = new UserProfileDTO(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone()
        );
        
        return ResponseEntity.ok(profileDTO);
    }

    @PutMapping
    @Operation(summary = "Update current user's profile")
    public ResponseEntity<UserProfileDTO> updateCurrentUserProfile(@RequestBody UserProfileDTO profileDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Ensure the user can only update their own profile
        if (!currentUser.getId().equals(profileDTO.getId())) {
            return ResponseEntity.badRequest().body(null);
        }
        
        // Ensure username cannot be changed
        if (!currentUser.getUsername().equals(profileDTO.getUsername())) {
            return ResponseEntity.badRequest().body(null);
        }
        
        try {
            User updatedUser = userService.updateUserProfile(
                    profileDTO.getId(),
                    profileDTO.getFullName(),
                    profileDTO.getEmail(),
                    profileDTO.getPhone()
            );
            
            UserProfileDTO updatedProfileDTO = new UserProfileDTO(
                    updatedUser.getId(),
                    updatedUser.getUsername(),
                    updatedUser.getFullName(),
                    updatedUser.getEmail(),
                    updatedUser.getPhone()
            );
            
            return ResponseEntity.ok(updatedProfileDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change current user's password")
    public ResponseEntity<String> changePassword(@RequestBody PasswordChangeDTO passwordChangeDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        try {
            // Validate password confirmation
            if (!passwordChangeDTO.getNewPassword().equals(passwordChangeDTO.getConfirmPassword())) {
                return ResponseEntity.badRequest().body("New password and confirmation password do not match");
            }
            
            userService.changePassword(
                    currentUser.getId(),
                    passwordChangeDTO.getCurrentPassword(),
                    passwordChangeDTO.getNewPassword()
            );
            
            return ResponseEntity.ok("Password changed successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to change password: " + e.getMessage());
        }
    }
}
