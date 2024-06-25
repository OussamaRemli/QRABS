package com.ensaoSquad.backend.controller;


import com.ensaoSquad.backend.dto.StudentAbsenceDTO;
import com.ensaoSquad.backend.model.*;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.*;
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

    private Map<Long, String> levelCode = new HashMap<>();


//    @PostMapping("/scan/{sessionId}/{levelId}/{group}")
//    public ResponseEntity<String> markPresent(@PathVariable long sessionId , @RequestParam long Apogee , @PathVariable long levelId ,@PathVariable String group){
//        Student student = studentService.findByApogee(Apogee);
//        if (student == null) {
//            return new ResponseEntity<>("Étudiant introuvable avec l'apogée : " + Apogee, HttpStatus.NOT_FOUND);
//        }else{
//            Level level =student.getLevel();
//            if(level.getLevelId()!=levelId){
//                return new ResponseEntity<>("Vous etes pas de ce niveau : " , HttpStatus.NOT_FOUND);
//            }else {
//                if(!student.getGroupName().equals(group) && !group.equals("none")){
//                    return new ResponseEntity<>("Vous etes pas de ce group : " , HttpStatus.NOT_FOUND);
//
//                }
//            }
//        }
//
//
//        Long studentId = student.getStudentId();
//        absenceService.markPresnt(sessionId,studentId,levelId,Apogee);
//        return new ResponseEntity<>("Success", HttpStatus.OK);
//    }

    @PostMapping("/scan/{sessionId}/{levelId}/{group}")
    public ResponseEntity<String> markPresent(
            @PathVariable long sessionId,
            @RequestParam long Apogee,
            @RequestParam String code,
            @PathVariable long levelId,
            @PathVariable String group) {

        if(code.equals(levelCode.get(levelId))){

        Student student = studentService.findByApogee(Apogee);
        if (student == null) {
            return new ResponseEntity<>("Étudiant introuvable avec l'apogée : " + Apogee, HttpStatus.NOT_FOUND);
        } else {
            Level level = student.getLevel();
            if (level.getLevelId() != levelId) {
                return new ResponseEntity<>("Vous n'êtes pas de ce niveau : ", HttpStatus.NOT_FOUND);
            } else {
                if (!student.getGroupName().equals(group) && !group.equals("none")) {
                    return new ResponseEntity<>("Vous n'êtes pas de ce groupe : ", HttpStatus.NOT_FOUND);
                }
            }
        }
        Long studentId = student.getStudentId();
        absenceService.markPresnt(sessionId, studentId, levelId, Apogee,group);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }else {
            return new ResponseEntity<>("Séance invalide",HttpStatus.NOT_FOUND);
        }
    }

    // Additional endpoint to fetch student info
    @GetMapping("/student/{apogee}")
    public ResponseEntity<Student> getStudentInfo(@PathVariable long apogee) {
        Student student = studentService.findByApogee(apogee);
        if (student == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(student, HttpStatus.OK);
    }


    @PostMapping("/isnotpresent/{levelId}/{Apogee}/{group}")
    public void isNotpresent(@PathVariable Long levelId , @PathVariable Long Apogee, @PathVariable String group){
        Student student = studentService.findByApogee(Apogee);
        Long studentId = student.getStudentId();
        absenceService.isNotPresent(studentId,levelId,Apogee,group);
    }


    @PostMapping("/{sessionId}/{levelId}/{group}")
    public  void endSession(@PathVariable long sessionId ,@PathVariable long levelId,@PathVariable String group){
        absenceService.markAbsent(sessionId,levelId,group);

    }
    //avec professor

//    @GetMapping("/absence/count")
//    public ResponseEntity<Map<Student, Map<String, Long>>> getAbsenceCounts(
//            @RequestParam("professorId") long professorId,
//            @RequestParam("moduleId") long moduleId,
//            @RequestParam("levelId") long levelId) {
//
//        // Assuming you have services to retrieve Professor, Module, and Level by their IDs
//        Professor professor = ProfessorMapper.toEntity( professorService.findById(professorId));
//        Module module = moduleService.findById(moduleId);
//        Level level = levelService.findById(levelId);
//
//        Map<Student, Map<String, Long>> absenceCounts = absenceService.getAbsenceCountsByProfessorModuleAndLevel(professor, module, level);
//
//        return ResponseEntity.ok(absenceCounts);
//    }
    @GetMapping("/absence/count")
    public ResponseEntity<Map<Student, Map<String, Long>>> getAbsenceCounts(
            @RequestParam("moduleId") long moduleId,
            @RequestParam("levelId") long levelId) {

        Module module = moduleService.findById(moduleId);
        Level level = levelService.findById(levelId);

        Map<Student, Map<String, Long>> absenceCounts = absenceService.getAbsenceCountsByModuleAndLevel(module, level);

        return ResponseEntity.ok(absenceCounts);
    }

//    @GetMapping("/absence/count/total")
//    public ResponseEntity<List<Long>> getAbsenceCountsTotal(
//            @RequestParam("professorId") long professorId,
//            @RequestParam("moduleId") long moduleId,
//            @RequestParam("levelId") long levelId) {
//
//        // Assuming you have services to retrieve Professor, Module, and Level by their IDs
//        Professor professor = ProfessorMapper.toEntity( professorService.findById(professorId));
//        Module module = moduleService.findById(moduleId);
//        Level level = levelService.findById(levelId);
//
//        Map<Student, Map<String, Long>> absenceCounts = absenceService.getAbsenceCountsByProfessorModuleAndLevel(professor, module, level);
//
//        long totalCours = 0;
//        long totalTp = 0;
//        long totalTd = 0;
//
//        for (Map<String, Long> studentAbsence : absenceCounts.values()) {
//            // Accumulate counts for each session type
//            totalCours += studentAbsence.getOrDefault("cours", 0L);
//            totalTp += studentAbsence.getOrDefault("tp", 0L);
//            totalTd += studentAbsence.getOrDefault("td", 0L);
//        }
//        List<Long> totalCounts = new ArrayList<>();
//
//        totalCounts.add(totalCours);
//        totalCounts.add(totalTp);
//        totalCounts.add(totalTd);
//
//        return ResponseEntity.ok(totalCounts);
//    }
@GetMapping("/absence/count/total")
public ResponseEntity<List<Long>> getAbsenceCountsTotal(
        @RequestParam("moduleId") long moduleId,
        @RequestParam("levelId") long levelId) {

    Module module = moduleService.findById(moduleId);
    Level level = levelService.findById(levelId);

    Map<Student, Map<String, Long>> absenceCounts = absenceService.getAbsenceCountsByModuleAndLevel(module, level);

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

    @GetMapping("/module/level")
    public ResponseEntity<Boolean> getMaxAbsence(@RequestParam("levelId") long levelId, @RequestParam("module_id") long moduleId) {
        return ResponseEntity.ok(absenceService.getMaxAbsence(moduleId,levelId));
    }
    @GetMapping("/absence/level")
    public ResponseEntity<Boolean> getMaxAbsenceByLevel(@RequestParam("levelId") long levelId) {
        return ResponseEntity.ok(absenceService.getMaxAbsenceByLevel(levelId));
    }

    @GetMapping("/code")
    public ResponseEntity<String> generateCode(@RequestParam("levelId") long levelId) {
        String code = sendCode(levelId);
        return ResponseEntity.ok(code); // Return the generated code in the response
    }


    @PostMapping("/forprofesseur/{sessionId}/{levelId}/{group}")
    public ResponseEntity<String> isPresent( @PathVariable long sessionId,
                                             @RequestParam long Apogee,
                                             @PathVariable long levelId,
                                             @PathVariable String group

    ){
        Student student = studentService.findByApogee(Apogee);
        Long studentId = student.getStudentId();
        System.out.println("recu oui tu as réaliser "+ Apogee);
        absenceService.markPresnt(sessionId, studentId, levelId, Apogee,group);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    public String sendCode(long levelId) {
        String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        Random random = new Random();
        StringBuilder sb = new StringBuilder(10);

        for (int i = 0; i <10; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            sb.append(CHARACTERS.charAt(randomIndex));
        }
        levelCode.put(levelId,sb.toString());
        this.template.convertAndSend("/topic/code/"+levelId, sb.toString());

        System.out.println(sb.toString()+"is sent");
        return sb.toString();


    }
}
