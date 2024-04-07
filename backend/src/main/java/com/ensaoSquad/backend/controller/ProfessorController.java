package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.dto.ProfessorDTO;
import com.ensaoSquad.backend.dto.StudentDTO;
import com.ensaoSquad.backend.service.ProfessorService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping({"/api/professors","/api/professors"})
public class ProfessorController {

    private final ProfessorService professorService;

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
    public ResponseEntity<?> uploadStudentsFromExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Uploaded file is empty");
        }

        List<ProfessorDTO> uploadedprofs = professorService.saveByExcel(file);
        return ResponseEntity.ok(uploadedprofs);
    }
    @GetMapping("/all")
    //@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public List<ProfessorDTO> findAll() {
        return professorService.findAll();
    }

    @GetMapping("/{id}")
    //@PreAuthorize("hasAnyAuthority('ROLE_PROFESSOR')")
    public ProfessorDTO findById(@PathVariable Long id) {
        return professorService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        professorService.delete(id);
    }

    @PutMapping
    public ProfessorDTO update(@RequestBody ProfessorDTO professorDto) {
        return professorService.update(professorDto);
    }

}