package com.ensaoSquad.backend.service;
import com.ensaoSquad.backend.dto.ProfessorDTO;

import java.util.List;

public interface ProfessorService {
    ProfessorDTO save(ProfessorDTO professorDto);
    List<ProfessorDTO> findAll();
    ProfessorDTO findById(Long id);

    ProfessorDTO findByName(String name);
    void delete(Long id);
}