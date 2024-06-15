package com.ensaoSquad.backend.controller;
import com.ensaoSquad.backend.repository.ProfessorRepository;
import com.ensaoSquad.backend.service.impl.JwtService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.dto.LoginDTO;
import com.ensaoSquad.backend.service.AuthService;
import com.ensaoSquad.backend.service.impl.AuthServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthServiceImp authServiceImp;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/confirm-password")
    public ResponseEntity<?> confirmPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String providedPassword = request.get("password");

            // Check if the request contains both email and password
            if (email == null || providedPassword == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing email or password in request body.");
            }

            // Find the professor by email
            Professor professor = professorRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

            // Check if the provided password matches the hashed password of the professor
            if (passwordEncoder.matches(providedPassword, professor.getPassword())) {
                return ResponseEntity.ok().body("Password confirmed successfully.");
            } else {
                // Return "code incorrecte" if the password is invalid
                return ResponseEntity.ok().body("code incorrecte");
            }
        } catch (UsernameNotFoundException ex) {
            // Handle case where user is not found
            return ResponseEntity.ok().body("User not found.");
        } catch (IllegalArgumentException ex) {
            // Handle case where request body is missing required parameters
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing email or password in request body.");
        } catch (Exception ex) {
            // Handle any other unexpected exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + ex.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginDTO loginDTO) {
        Professor professor = authServiceImp.authenticate(loginDTO);

        if (professor == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        // Authentification réussie, renvoyer l'objet Professor
        return ResponseEntity.ok(professor);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProfessorById(@PathVariable("id") Long id) {
        Professor professor = authServiceImp.findProfessorById(id);

        if (professor == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Professor not found");
        }

        return ResponseEntity.ok(professor);
    }


}
