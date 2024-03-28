package com.ensaoSquad.backend.controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.dto.LoginDTO;
import com.ensaoSquad.backend.service.AuthService;
import com.ensaoSquad.backend.service.impl.AuthServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthServiceImp authServiceImp;

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
