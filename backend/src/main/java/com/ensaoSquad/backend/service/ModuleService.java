package com.ensaoSquad.backend.service;

import com.ensaoSquad.backend.dto.ModuleDTO;

import java.util.List;

public interface ModuleService {
    ModuleDTO createModule(ModuleDTO moduleDto);
    List<ModuleDTO> getAllModule();



    ModuleDTO findModuleByName(String name);
}
