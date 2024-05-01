package com.ensaoSquad.backend.controller;


import com.ensaoSquad.backend.dto.StudentAbsenceDTO;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.exception.StudentNotFoundException;
import com.ensaoSquad.backend.mapper.ProfessorMapper;
import com.ensaoSquad.backend.model.*;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.service.*;
import com.ensaoSquad.backend.service.impl.ProfessorServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;


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

    @PostMapping("/scan/{sessionId}/{levelId}/{group}")
    public ResponseEntity<String> markPresent(@PathVariable long sessionId , @RequestParam long Apogee , @PathVariable long levelId ,@PathVariable String group,@RequestParam String ip){
        Student student = studentService.findByApogee(Apogee);
        if (student == null) {
            return new ResponseEntity<>("Étudiant introuvable avec l'apogée : " + Apogee, HttpStatus.NOT_FOUND);
        }else{
            Level level =student.getLevel();
            if(level.getLevelId()!=levelId){
                return new ResponseEntity<>("Vous etes pas de ce niveau : " , HttpStatus.NOT_FOUND);
            }else {
                if(!student.getGroupName().equals(group) && !group.equals("none")){
                    return new ResponseEntity<>("Vous etes pas de ce group : " , HttpStatus.NOT_FOUND);

                }
            }
        }


        Long studentId = student.getStudentId();
        absenceService.markPresnt(sessionId,studentId,levelId,ip,Apogee);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    @PostMapping("/isnotpresent/{levelId}/{Apogee}")
    public void isNotpresent(@PathVariable Long levelId , @PathVariable Long Apogee){
        Student student = studentService.findByApogee(Apogee);
        Long studentId = student.getStudentId();
        absenceService.isNotPresent(studentId,levelId,Apogee);
    }


    @PostMapping("/{sessionId}/{levelId}/{group}")
    public  void endSession(@PathVariable long sessionId ,@PathVariable long levelId,@PathVariable String group){
        absenceService.markAbsent(sessionId,levelId,group);

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

    @GetMapping("/absence/count/total")
    public ResponseEntity<List<Long>> getAbsenceCountsTotal(
            @RequestParam("professorId") long professorId,
            @RequestParam("moduleId") long moduleId,
            @RequestParam("levelId") long levelId) {

        // Assuming you have services to retrieve Professor, Module, and Level by their IDs
        Professor professor = ProfessorMapper.toEntity( professorService.findById(professorId));
        Module module = moduleService.findById(moduleId);
        Level level = levelService.findById(levelId);

        Map<Student, Map<String, Long>> absenceCounts = absenceService.getAbsenceCountsByProfessorModuleAndLevel(professor, module, level);

        long totalCours = 0;
        long totalTp = 0;
        long totalTd = 0;

        for (Map<String, Long> studentAbsence : absenceCounts.values()) {
            // Accumulate counts for each session type
            totalCours += studentAbsence.getOrDefault("cours", 0L);
            totalTp += studentAbsence.getOrDefault("tp", 0L);
            totalTd += studentAbsence.getOrDefault("td", 0L);
        }
        List<Long> totalCounts = new ArrayList<>();

        totalCounts.add(totalCours);
        totalCounts.add(totalTp);
        totalCounts.add(totalTd);

        return ResponseEntity.ok(totalCounts);
    }

    @GetMapping("/absence/details")
    public ResponseEntity<Map<Student, List<StudentAbsenceDTO>>> getAbsenceDetailsOfStudent(
            @RequestParam("studentApogee") long studentApogee,
            @RequestParam("moduleId") Long moduleId) {

        Module module = moduleService.findById(moduleId);
        Map<Student, List<StudentAbsenceDTO>> absenceDetails = absenceService.getStudentAbsenceDetail(studentApogee,module);

        return ResponseEntity.ok(absenceDetails);
    }

    @GetMapping("/level/module")
    public ResponseEntity<Long> countAbsenceByLevelAndModuleName(@RequestParam("levelId") long levelId, @RequestParam("moduleName") String moduleName) {
        return ResponseEntity.ok(absenceService.countAbsenceByLevelAndModuleName(levelId, moduleName));
    }
    @GetMapping("/level")
    public ResponseEntity<Long> countAbsenceInLevel(@RequestParam("levelId") long levelId) {
        Level level = levelService.findById(levelId);
        return ResponseEntity.ok(absenceService.countAbsenceInLevel(level));
    }

    @PutMapping("/absence/justify")
    public ResponseEntity<?> justifyAbsence(@RequestParam("absenceId") long absenceId) {

        Absence absence = absenceService.findAbsenceById(absenceId);
        Date currentDate = new Date();
        Date absenceDate = absence.getDateAbsence();

        // Calculate the difference in milliseconds between the current date and absence date
        long differenceInMillis = currentDate.getTime() - absenceDate.getTime();

        // Calculate the difference in days
        long differenceInDays = TimeUnit.MILLISECONDS.toDays(differenceInMillis);

        // Check if the difference is more than 3 days
        if (differenceInDays > 3) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Impossible de justifier l'absence car cela fait plus de 3 jours depuis la date de l'absence.");
        }

        Absence updatedAbsence = absenceService.toggleJustified(absenceId);
        return ResponseEntity.ok(updatedAbsence);
    }

}
