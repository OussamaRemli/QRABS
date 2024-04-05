package com.ensaoSquad.backend.service.impl;


import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.dto.ModuleDTO;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.mapper.ModuleMapper;

import com.ensaoSquad.backend.repository.DepartmentRepository;
import com.ensaoSquad.backend.repository.ModuleRepository;
import com.ensaoSquad.backend.service.ModuleService;
import com.ensaoSquad.backend.service.SessionService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
@AllArgsConstructor
public class ModuleServiceImp implements ModuleService {

    @Autowired
    private final ModuleRepository moduleRepository;
    @Autowired
    private final DepartmentRepository departmentRepository;
    private SessionService sessionService;
    @Autowired
    private void setSessionService(@Lazy SessionService sessionService){
        this.sessionService=sessionService;
    }


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
    public ModuleDTO findModuleById(long id) {
        Module module = moduleRepository.findByModuleId(id).orElseThrow(() ->
                new RessourceNotFoundException("Module: " + id + " n'existe pas")
        );
        return ModuleMapper.toDTO(module);
    }

    @Override
    public ModuleDTO getCurrentModule(long id) {
        long currentTimeMillis = System.currentTimeMillis();
        Time time = new Time(currentTimeMillis);
        LocalDate currentDay =LocalDate.now();
        String day = currentDay.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        Long ModuleId = sessionService.findModuleIdsByProfessorIdAndCurrentTimeAndDay(id,day,time);

        return findModuleById(ModuleId);
    }


}