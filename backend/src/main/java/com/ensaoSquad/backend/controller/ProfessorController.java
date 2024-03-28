package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.dto.ProfessorDTO;
import com.ensaoSquad.backend.service.ProfessorService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping({"/api/professors","/api/professors"})
public class ProfessorController {

    private final ProfessorService professorService;

    @PostMapping
    public ProfessorDTO create(@RequestBody ProfessorDTO professorDto) {
        return professorService.save(professorDto);
    }

    @GetMapping
    public List<ProfessorDTO> findAll() {
        return professorService.findAll();
    }

    @GetMapping("/{id}")
    public ProfessorDTO findById(@PathVariable Long id) {
        return professorService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        professorService.delete(id);
    }
}