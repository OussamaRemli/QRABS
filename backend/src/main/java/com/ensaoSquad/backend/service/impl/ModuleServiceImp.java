package com.ensaoSquad.backend.service.impl;


import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.dto.ModuleDTO;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.mapper.ModuleMapper;

import com.ensaoSquad.backend.repository.DepartmentRepository;
import com.ensaoSquad.backend.repository.ModuleRepository;
import com.ensaoSquad.backend.service.ModuleService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ModuleServiceImp implements ModuleService {


    private final ModuleRepository moduleRepository;
    private final DepartmentRepository departmentRepository;


    @Override
    public ModuleDTO createModule(ModuleDTO moduleDto) {

        Department department = departmentRepository.findById(moduleDto.getDepartment().getDepartmentId())
                .orElseThrow(() -> new RessourceNotFoundException("Department not found with ID: " + moduleDto.getDepartment().getDepartmentId()));
        com.ensaoSquad.backend.model.Module module = ModuleMapper.toEntity(moduleDto);
        com.ensaoSquad.backend.model.Module SavedModule = moduleRepository.save(module);
        return ModuleMapper.toDTO(SavedModule);
    }

    @Override
    public List<ModuleDTO> getAllModule() {
        List<ModuleDTO> moduleDtoList = moduleRepository.findAll().stream().map(ModuleMapper::toDTO).toList();
        if (moduleDtoList.isEmpty()) {
            throw new RessourceNotFoundException("Il n'y a pas de modules");
        }
        return moduleDtoList;
    }

    @Override
    public void deleteModule(Long moduleId) {
        if (!moduleRepository.existsById(moduleId)) {
            throw new RessourceNotFoundException("Module not found with ID: " + moduleId);
        }
        moduleRepository.deleteById(moduleId);
    }

    @Override
    public ModuleDTO updateModule(Long moduleId, ModuleDTO moduleDto) {
        Module existingModule = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RessourceNotFoundException("Module not found with ID: " + moduleId));
        existingModule.setModuleName(moduleDto.getModuleName());
        existingModule.setDepartment(departmentRepository.findById(moduleDto.getDepartment().getDepartmentId())
                .orElseThrow(() -> new RessourceNotFoundException("Department not found with ID: " + moduleDto.getDepartment().getDepartmentId())));

        // Save the updated mod
        Module updatedModule = moduleRepository.save(existingModule);
        return ModuleMapper.toDTO(updatedModule);
    }

    @Override
    public ModuleDTO findModuleByName(String name) {
        Module module = moduleRepository.findByModuleName(name).orElseThrow(() ->
                new RessourceNotFoundException("Module: " + name + " n'existe pas")
        );
        return ModuleMapper.toDTO(module);
    }



}