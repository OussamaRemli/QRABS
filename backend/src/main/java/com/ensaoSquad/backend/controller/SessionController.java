package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.dto.ProfessorModulesDTO;
import com.ensaoSquad.backend.dto.SessionDTO;
import com.ensaoSquad.backend.exception.MultipleFoundException;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.model.Module;
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

         try {
             List<SessionDTO> uploadedSessions = sessionService.uploadSessionFromExcel(file);
             return ResponseEntity.ok(uploadedSessions);
         }catch (RessourceNotFoundException | MultipleFoundException ex){
             throw ex;
         }
         catch (Exception e) {
             // Other exceptions handling if needed
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
         }
     }

    @GetMapping("/currentSession/{professorId}")
    public List<Session> getCurrentSession(@PathVariable Long professorId) {
        List<Session> sessions = sessionService.getCurrentSession(professorId);
        if (sessions.isEmpty()) {
            return sessionService.getNextSession(professorId);
        } else {
            return sessions;
        }
    }
    @GetMapping("/professor/{professorId}/modules")
    public ResponseEntity<List<Module>> getModulesByProfessorId(@PathVariable Long professorId) {
        List<Module> modules = sessionService.getProfessorsAndModules(professorId);
        return ResponseEntity.ok(modules);
    }

    @GetMapping("/sessions/{professorId}")
    public List<Session> getAllSession(@PathVariable Long professorId) {
        List<Session> sessions = sessionService.findAllSessionForProfessor(professorId);
        if (sessions.isEmpty()) {
            return sessionService.getNextSession(professorId);
        } else {
            return sessions;
        }
    }
    /*
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }
     */


    @DeleteMapping("/deleteAll")
    public ResponseEntity<Void> deleteAllSessions() {
        boolean sessionsExist = sessionService.anySessionsExist();

        if (!sessionsExist) {
            return ResponseEntity.ok().build(); // Return success if no sessions exist
        }

        sessionService.deleteAllsession(); // Delete all sessions
        return ResponseEntity.noContent().build(); // Return success after deletion
    }




}
