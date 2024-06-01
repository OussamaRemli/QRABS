package com.ensaoSquad.backend.controller;
import com.ensaoSquad.backend.dto.ProfessorDTO;
import com.ensaoSquad.backend.exception.DuplicateException;
import com.ensaoSquad.backend.exception.ProfessorNotFoundException;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.exception.UploadExcelException;
import com.ensaoSquad.backend.service.ProfessorService;
import com.ensaoSquad.backend.service.impl.JwtService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping({"/api/professors","/api/professors"})
public class ProfessorController {
    @Autowired
    private  ProfessorService professorService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;

    //Test Method
    @GetMapping("/welcome")
    public String welcome(){
        return "Welcome Professor!";
    }
    @PostMapping
    public ProfessorDTO create(@RequestBody ProfessorDTO professorDto) {
        return professorService.save(professorDto);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadProfsFromExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Uploaded file is empty");
        }

        try {
            List<ProfessorDTO> uploadedprofs = professorService.saveByExcel(file);
            return ResponseEntity.ok(uploadedprofs);
        }catch (UploadExcelException | RessourceNotFoundException | DuplicateException ex){
            throw ex;
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/all")
//    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public List<ProfessorDTO> findAll() {
        return professorService.findAll();
    }

    @GetMapping("/{id}")
//    @PreAuthorize("hasAnyAuthority('ROLE_PROFESSOR')")
    public ProfessorDTO findById(@PathVariable Long id) {
        return professorService.findById(id);
    }

    @GetMapping("/department/{departmentName}")
    public List<ProfessorDTO> findByDepartmentName(@PathVariable String departmentName) {
        return professorService.findByDepartmentName(departmentName);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        professorService.delete(id);
    }

    @PutMapping
    public ProfessorDTO update(@RequestBody ProfessorDTO professorDto) {

        return professorService.update(professorDto);
    }
    @PostMapping("/authenticate")
    public String authenticateAndGetToken(@RequestBody ProfessorDTO professorDTO) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(professorDTO.getEmail(), professorDTO.getPassword()));
        if (authentication.isAuthenticated()) {
            // Récupérer les informations du professeur à partir de la base de données ou de toute autre source
            Optional<ProfessorDTO> optionalAuthenticatedProfessor = professorService.findByEmail(professorDTO.getEmail());
            // Vérifier si le professeur existe
            if (optionalAuthenticatedProfessor.isPresent()) {
                // Générer le token JWT avec les informations du professeur authentifié
                return jwtService.generateToken(optionalAuthenticatedProfessor.get());
            } else {
                throw new UsernameNotFoundException("Professor not found with email: " + professorDTO.getEmail());
            }
        } else {
            throw new UsernameNotFoundException("Invalid user request !");
        }
    }
    @PutMapping("/{professorId}/email")
    public ResponseEntity<String> updateEmail(@PathVariable Long professorId, @RequestBody String newEmail) {
        try {
            // Parsing the request body as JSON to extract the email
            ObjectMapper mapper = new ObjectMapper();
            JsonNode emailNode = mapper.readTree(newEmail);
            String email = emailNode.get("email").asText();

            professorService.updateEmail(professorId, email);
            return ResponseEntity.ok("E-mail updated successfully.");
        } catch (IOException e) {
            // Handle JSON parsing exception
            return ResponseEntity.badRequest().body("Invalid request body.");
        } catch (ProfessorNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{professorId}/password")
    public ResponseEntity<String> updatePassword(@PathVariable Long professorId, @RequestBody String newPassword) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode passwordNode = mapper.readTree(newPassword);
            String password = passwordNode.get("password").asText();
            professorService.updatePassword(professorId, password);
            return ResponseEntity.ok("Password updated successfully.");
        } catch (IOException e) {
            // Handle JSON parsing exception
            return ResponseEntity.badRequest().body("Invalid request body.");
        } catch (ProfessorNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}