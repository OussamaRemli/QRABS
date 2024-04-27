package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.dto.ModuleDTO;
import com.ensaoSquad.backend.dto.ModuleStatsDTO;
import com.ensaoSquad.backend.dto.ProfessorDTO;
import com.ensaoSquad.backend.mapper.ModuleMapper;
import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.service.ModuleService;
import com.ensaoSquad.backend.service.SessionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping({"/api/modules","/api/modules"})
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class ModuleController {
    private final  ModuleService moduleService;
    private final SessionService sessionService;

    @PostMapping
    public ResponseEntity<ModuleDTO> createModule(@RequestBody ModuleDTO ModuleDTO){


        ModuleDTO SavedModule=moduleService.createModule(ModuleDTO);
        return new ResponseEntity<>(SavedModule, HttpStatus.CREATED);
    }

    @GetMapping

    public  ResponseEntity<List<ModuleDTO>> getAllModule(){
        return ResponseEntity.ok(moduleService.getAllModule());
    }

    @GetMapping("/{name}")

    public ResponseEntity<ModuleDTO> findByModuleName(@PathVariable String name){
        return ResponseEntity.ok(moduleService.findModuleByName(name));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ModuleDTO> updateModule(@PathVariable Long id, @RequestBody ModuleDTO moduleDTO) {
        ModuleDTO updatedModule = moduleService.updateModule(id, moduleDTO);
        return ResponseEntity.ok(updatedModule);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }



    // Trouver le module á partir la séance actuelle 
    @GetMapping("/currentModule/{id}")
    public ModuleDTO getCurrentModule(@PathVariable Long id){
        long currentTimeMillis = System.currentTimeMillis();
        Time time = new Time(currentTimeMillis);
        LocalDate currentDay =LocalDate.now();
        String day = currentDay.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        Long ModuleId = sessionService.findModuleIdsByProfessorIdAndCurrentTimeAndDay(id,day,time);

        return moduleService.findModuleById(ModuleId);


    }
    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<ModuleDTO>> getModulesByProfessor(@PathVariable Long professorId) {
        Professor professor = new Professor(); // Create Professor object based on professorId
        professor.setProfessorId(professorId);
        List<ModuleDTO> moduleDTOList = moduleService.getModulesByProfessor(professor);
        return ResponseEntity.ok(moduleDTOList);
    }

    @GetMapping("/level/{levelId}")
    public ResponseEntity<List<ModuleDTO>> getModulesByLevel(@PathVariable Long levelId) {
        Level level = new Level(); // Create Level object based on levelId
        level.setLevelId(levelId);
        List<ModuleDTO> moduleDTOList = moduleService.getModulesByLevel(level);
        return ResponseEntity.ok(moduleDTOList);
    }
    @GetMapping("/levelName/{levelName}")
    public ResponseEntity<List<ModuleDTO>> getModulesByLevelName(@PathVariable String levelName) {
        List<ModuleDTO> moduleDTOList = moduleService.getModulesByLevelName(levelName);
        return ResponseEntity.ok(moduleDTOList);
    }

    @GetMapping("/department/{departmentName}")
    public ResponseEntity<List<ModuleDTO>> getModulesByDepartmentName(@PathVariable String departmentName) {
        List<ModuleDTO> moduleDTOList = moduleService.getModulesByDepartmentName(departmentName);
        return ResponseEntity.ok(moduleDTOList);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadModulesFromExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Uploaded file is empty");
        }

        List<ModuleDTO> uploadedModules = moduleService.uploadByExcel(file);
        return ResponseEntity.ok(uploadedModules);
    }

    @PostMapping("/uploadRespo")
    public ResponseEntity<?> uploadModulesFromExcelRespo(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Uploaded file is empty");
        }

        moduleService.uploadRespoModule(file);
        return ResponseEntity.ok("uploaded");
    }

    @GetMapping("/{moduleId}/stats")
    public ResponseEntity<ModuleStatsDTO> getModuleStats(@PathVariable Long moduleId) {
        ModuleDTO moduleDto = moduleService.findModuleById(moduleId);

        Module module= ModuleMapper.toEntity(moduleDto);
        int totalSessions = moduleService.getNombreDeSeancesPourModule(module);
        int totalAbsences = moduleService.getNombreTotalAbsencesPourModule(module);
        int totalStudents=moduleService.countStudentsInLevel(module);

        ModuleStatsDTO moduleStatsDTO = new ModuleStatsDTO();
        moduleStatsDTO.setTotalSessions(totalSessions);
        moduleStatsDTO.setTotalAbsences(totalAbsences);
        moduleStatsDTO.setTotalEleves(totalStudents);

        return ResponseEntity.ok(moduleStatsDTO);
    }



}
