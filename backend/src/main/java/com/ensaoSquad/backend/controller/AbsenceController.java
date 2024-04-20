package com.ensaoSquad.backend.controller;


import com.ensaoSquad.backend.dto.StudentAbsenceDTO;
import com.ensaoSquad.backend.exception.StudentNotFoundException;
import com.ensaoSquad.backend.mapper.ProfessorMapper;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.model.Student;
import com.ensaoSquad.backend.service.*;
import com.ensaoSquad.backend.service.impl.ProfessorServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/absence")
@CrossOrigin(origins = "*")
public class AbsenceController {
    @Autowired
    private SimpMessagingTemplate template;
    @Autowired
    private AbsenceService absenceService;
    @Autowired
    private StudentService studentService;
    @Autowired
    ProfessorService professorService;
    @Autowired
    ModuleService moduleService;
    @Autowired
    LevelService levelService;

    @PostMapping("/scan/{sessionId}/{levelId}")
    public ResponseEntity<String> markPresent(@PathVariable long sessionId , @RequestParam long Apogee , @PathVariable long levelId ,@RequestParam String ip){
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
        absenceService.markPresnt(sessionId,studentId,levelId,ip,Apogee);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }


    @PostMapping("/{sessionId}/{levelId}")
    public  void endSession(@PathVariable long sessionId ,@PathVariable long levelId){
        absenceService.markAbsent(sessionId,levelId);

    }

    @GetMapping("/absence/count")
    public ResponseEntity<Map<Student, Map<String, Long>>> getAbsenceCounts(
            @RequestParam("professorId") long professorId,
            @RequestParam("moduleId") long moduleId,
            @RequestParam("levelId") long levelId) {

        // Assuming you have services to retrieve Professor, Module, and Level by their IDs
        Professor professor = ProfessorMapper.toEntity( professorService.findById(professorId));
        Module module = moduleService.findById(moduleId);
        Level level = levelService.findById(levelId);

        Map<Student, Map<String, Long>> absenceCounts = absenceService.getAbsenceCountsByProfessorModuleAndLevel(professor, module, level);

        return ResponseEntity.ok(absenceCounts);
    }

    @GetMapping("/absence/details")
    public ResponseEntity<Map<Student, List<StudentAbsenceDTO>>> getAbsenceDetailsOfStudent(
            @RequestParam("studentApogee") long studentApogee,
            @RequestParam("moduleId") Long moduleId) {

        Module module = moduleService.findById(moduleId);

        Map<Student, List<StudentAbsenceDTO>> absenceDetails = absenceService.getStudentAbsenceDetail(studentApogee,module);

        return ResponseEntity.ok(absenceDetails);
    }


}
