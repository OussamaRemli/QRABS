package com.ensaoSquad.backend.service;

import com.ensaoSquad.backend.dto.ModuleDTO;
import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Professor;

import java.util.List;

public interface ModuleService {
    ModuleDTO createModule(ModuleDTO moduleDto);
    List<ModuleDTO> getAllModule();

    void deleteModule(Long moduleId);
    ModuleDTO updateModule(Long moduleId, ModuleDTO moduleDto);
    ModuleDTO findModuleByName(String name);
    ModuleDTO findModuleById(long id) ;

    List<ModuleDTO> getModulesByProfessor(Professor professor);
    List<ModuleDTO> getModulesByLevel(Level level);
    List<ModuleDTO> getModulesByDepartment(Department department);

    }
