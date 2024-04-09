package com.ensaoSquad.backend.controller;


import com.ensaoSquad.backend.exception.StudentNotFoundException;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Student;
import com.ensaoSquad.backend.service.AbsenceService;
import com.ensaoSquad.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/absence")
@CrossOrigin(origins = "*")
public class AbsenceController {
    @Autowired
    private AbsenceService absenceService;
    @Autowired
    private StudentService studentService;

    @PostMapping("/scan/{sessionId}/{levelId}")
    public ResponseEntity<String> markPresent(@PathVariable long sessionId , @RequestParam long Apogee , @PathVariable long levelId){
        Student student = studentService.findByApogee(Apogee);
        if (student == null) {
            return new ResponseEntity<>("Étudiant introuvable avec l'apogée : " + Apogee, HttpStatus.NOT_FOUND);
        }else{
            Level level =student.getLevel();
            if(level.getLevelId()!=levelId){
                return new ResponseEntity<>("Vous etes pas de ce niveau : " , HttpStatus.NOT_FOUND);
            }
        }

        Long studentId = student.getStudentId();
        absenceService.markPresnt(sessionId,studentId,levelId);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }


    @PostMapping("/{sessionId}/{levelId}")
    public  void endSession(@PathVariable long sessionId ,@PathVariable long levelId){
        absenceService.markAbsent(sessionId,levelId);

    }


}
