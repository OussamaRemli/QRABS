package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.dto.ModuleDTO;
import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.model.Session;
import com.ensaoSquad.backend.service.ModuleService;
import com.ensaoSquad.backend.service.SessionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        Professor professor = new Professor();
        professor.setProfessorId(professorId);
        List<ModuleDTO> moduleDTOList = moduleService.getModulesByProfessor(professor);
        return ResponseEntity.ok(moduleDTOList);
    }
    @GetMapping("/level/{levelId}")
    public ResponseEntity<List<ModuleDTO>> getModulesByLevel(@PathVariable Long levelId) {
        Level level = new Level();
        level.setLevelId(levelId);
        List<ModuleDTO> moduleDTOList = moduleService.getModulesByLevel(level);
        return ResponseEntity.ok(moduleDTOList);
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<ModuleDTO>> getModulesByDepartment(@PathVariable Long departmentId) {
        Department department = new Department(); // Create Department object based on departmentId
        department.setDepartmentId(departmentId);
        List<ModuleDTO> moduleDTOList = moduleService.getModulesByDepartment(department);
        return ResponseEntity.ok(moduleDTOList);
    }


}
