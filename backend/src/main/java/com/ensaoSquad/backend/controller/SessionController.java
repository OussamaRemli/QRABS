package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.dto.SessionDTO;
import com.ensaoSquad.backend.model.Session;
import com.ensaoSquad.backend.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping({"/api/session","/api/session/"})
public class SessionController {

    @Autowired
    private SessionService sessionService;
     @PostMapping("/upload")
     public ResponseEntity<?> uploadSessionFromExcel(@RequestParam("file") MultipartFile file) {
         if (file.isEmpty()) {
             return ResponseEntity.badRequest().body("Uploaded file is empty");
         }

         List<SessionDTO> uploadedSessions = sessionService.uploadSessionFromExcel(file);
         return ResponseEntity.ok(uploadedSessions);
     }

     @GetMapping("/currentSession/{professorId}")
    public List<Session> getCurrentSession(@PathVariable Long professorId){
         return sessionService.getCurrentSession(professorId);
     }


}
