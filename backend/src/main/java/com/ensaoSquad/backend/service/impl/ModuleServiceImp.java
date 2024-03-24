package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.Model.Department;
import com.ensaoSquad.backend.Model.Module;
import com.ensaoSquad.backend.dto.ModuleDto;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.mapper.ModuleMapper;
import com.ensaoSquad.backend.repository.DepartmentRepository;
import com.ensaoSquad.backend.repository.ModuleRepository;
import com.ensaoSquad.backend.service.ModuleService;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ModuleServiceImp implements ModuleService {



    private final ModuleRepository moduleRepository;
    private final DepartmentRepository departmentRepository;
    @Override
    public ModuleDto createModule(ModuleDto moduleDto) {

        Department department = departmentRepository.findById(moduleDto.getDepartment().getDepartmentId())
                .orElseThrow(() -> new RessourceNotFoundException("Department not found with ID: " + moduleDto.getDepartment().getDepartmentId()));
        com.ensaoSquad.backend.Model.Module module= ModuleMapper.mapToModule(moduleDto);
        com.ensaoSquad.backend.Model.Module SavedModule=moduleRepository.save(module);
        return ModuleMapper.mapToModuleDto(SavedModule);
    }

    @Override
    public List<ModuleDto> getAllModule() {
        List<ModuleDto> moduleDtoList=moduleRepository.findAll().stream().map(ModuleMapper::mapToModuleDto).toList();
        if(moduleDtoList.isEmpty()){
            throw new RessourceNotFoundException("Il n'y a pas de modules");
        }
        return moduleDtoList;
    }

    @Override
    public ModuleDto findModuleByName(String name) {
        Module module=moduleRepository.findByModuleName(name).orElseThrow(() ->
                new RessourceNotFoundException("Module: "+name+" n'existe pas")
        );
        return ModuleMapper.mapToModuleDto(module);
    }




}
