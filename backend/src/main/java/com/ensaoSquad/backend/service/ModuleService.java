package com.ensaoSquad.backend.service;

import com.ensaoSquad.backend.dto.ModuleDto;

import java.util.List;

public interface ModuleService {
    ModuleDto createModule(ModuleDto moduleDto);
    List<ModuleDto> getAllModule();



    ModuleDto findModuleByName(String name);
}
