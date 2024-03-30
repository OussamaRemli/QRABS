package com.ensaoSquad.backend.service;

import com.ensaoSquad.backend.dto.ModuleDTO;

import java.util.List;

public interface ModuleService {
    ModuleDTO createModule(ModuleDTO moduleDto);
    List<ModuleDTO> getAllModule();

    void deleteModule(Long moduleId);
    ModuleDTO updateModule(Long moduleId, ModuleDTO moduleDto);
    ModuleDTO findModuleByName(String name);
}
