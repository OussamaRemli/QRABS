package com.ensaoSquad.backend.controller;
import com.ensaoSquad.backend.dto.ProfessorDTO;
import com.ensaoSquad.backend.exception.DuplicateException;
import com.ensaoSquad.backend.exception.ProfessorNotFoundException;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.exception.UploadExcelException;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.model.ResetPasswordRequest;
import com.ensaoSquad.backend.repository.ProfessorRepository;
import com.ensaoSquad.backend.service.ProfessorService;
import com.ensaoSquad.backend.service.impl.EmailService;
import com.ensaoSquad.backend.service.impl.JwtService;
import com.ensaoSquad.backend.service.impl.PasswordResetService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

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
    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordResetService passwordResetService;
    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"
    );
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



    @PostMapping("/forgot-password")
    public ResponseEntity<String> handleForgotPassword(@RequestParam String email) {
        // Validate email address format
        if (!isValidEmail(email)) {
            return ResponseEntity.badRequest().body("Invalid email address.");
        }

        try {
            // Check if the email exists in the database
            Optional<Professor> optionalProfessor = professorRepository.findByEmail(email);
            if (!optionalProfessor.isPresent()) {
                return ResponseEntity.badRequest().body("Email doesn't exist.");
            }

            // Generate verification code
            String verificationCode = passwordResetService.generateVerificationCode();

            // Send verification code by email
            boolean emailSent = emailService.sendEmail(email, "Verification Code", "Your verification code is: " + verificationCode);

            if (!emailSent) {
                throw new Exception("Failed to send email.");
            }

            // Store verification code in memory (to be replaced with a better solution)
            passwordResetService.getVerificationCodes().put(email, verificationCode);

            return ResponseEntity.ok("A verification code has been sent to your email address.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email. Error: " + e.getMessage());
        }
    }

    private boolean isValidEmail(String email) {
        // Ensure EMAIL_PATTERN is defined appropriately
        Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
        return EMAIL_PATTERN.matcher(email).matches();
    }



//    @PostMapping("/verify-code")
//    public ResponseEntity<String> verifyVerificationCode(@RequestBody ResetPasswordRequest request) {
//        try {
//            String email = request.getEmail();
//            String verificationCode = request.getVerificationCode();
//            System.out.println("Received email: " + email + " and verification code: " + verificationCode);
//
//            // Retrieve stored verification code
//            String storedCode = passwordResetService.getVerificationCodes().get(email);
//
//            // Validate the verification code
//            if (storedCode == null || !storedCode.equals(verificationCode)) {
//                return ResponseEntity.badRequest().body("Invalid verification code.");
//            }
//
//            // Optionally, you may want to remove the verification code from storage after successful validation
//            passwordResetService.getVerificationCodes().remove(email);
//
//            return ResponseEntity.ok("Verification code is valid.");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to verify code. Error: " + e.getMessage());
//        }
//    }
//
//
//    @PostMapping("/reset-password")
//    public ResponseEntity<String> handleResetPassword(@RequestBody ResetPasswordRequest request) {
//        try {
//            System.out.println("Received reset password request for email: " + request.getEmail());
//
//            // Vérifier le code de vérification
//            String storedCode = passwordResetService.getVerificationCodes().get(request.getEmail());
//            System.out.println(storedCode);
//            if (storedCode == null || !storedCode.equals(request.getVerificationCode())) {
//                System.out.println("Verification code incorrect for email: " + request.getVerificationCode());
//                return ResponseEntity.badRequest().body("Code de vérification incorrect.");
//            }
//
//            // Réinitialiser le mot de passe
//            Optional<Professor> optionalProfessor = professorRepository.findByEmail(request.getEmail());
//            if (!optionalProfessor.isPresent()) {
//                System.out.println("Professor not found for email: " + request.getEmail());
//                return ResponseEntity.notFound().build();
//            }
//            Professor professor = optionalProfessor.get();
//            professor.setPassword(passwordEncoder.encode(request.getNewPassword()));
//            professorRepository.save(professor);
//
//            System.out.println("Password reset successful for email: " + request.getEmail());
//            return ResponseEntity.ok("Mot de passe réinitialisé avec succès.");
//        } catch (Exception e) {
//            System.err.println("Error handling reset password request for email: " + request.getEmail());
//            e.printStackTrace();
//            return ResponseEntity.badRequest().body("Invalid request body.");
//        }
//    }
//

    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyVerificationCode(@RequestBody ResetPasswordRequest request, HttpServletRequest httpRequest) {
        try {
            String email = request.getEmail();
            String verificationCode = request.getVerificationCode();

            // Verify authenticity of the request
            boolean isValidRequest = validateRequest(httpRequest);
            if (!isValidRequest) {
                return ResponseEntity.badRequest().body("Invalid request. Please try again.");
            }

            // Retrieve stored verification code
            String storedCode = passwordResetService.getVerificationCodes().get(email);

            // Validate the verification code
            if (storedCode == null || !storedCode.equals(verificationCode)) {
                return ResponseEntity.badRequest().body("Invalid verification code.");
            }

            // Optionally, you may want to remove the verification code from storage after successful validation
            passwordResetService.getVerificationCodes().remove(email);

            // Proceed to update the password
            String newPassword = request.getNewPassword();
            Optional<Professor> optionalProfessor = professorRepository.findByEmail(email);
            if (!optionalProfessor.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            Professor professor = optionalProfessor.get();
            professor.setPassword(passwordEncoder.encode(newPassword));
            professorRepository.save(professor);

            return ResponseEntity.ok("Password updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to verify code and update password. Error: " + e.getMessage());
        }
    }


    private boolean validateRequest(HttpServletRequest request) {
        // Implement your validation logic here, such as checking headers, IP addresses, etc.
        // Example: Checking if the request is from a trusted IP range or verifying headers

        // For example, check if the request comes from a secure endpoint or specific IP address range
        String forwardedFor = request.getHeader("X-Forwarded-For");
        String remoteAddr = request.getRemoteAddr();

        // Example validation:
        // if (isTrustedIpAddress(remoteAddr) && isValidOrigin(forwardedFor)) {
        //    return true;
        // }

        // For simplicity, returning true always (you should implement actual validation logic)
        return true;
    }


}