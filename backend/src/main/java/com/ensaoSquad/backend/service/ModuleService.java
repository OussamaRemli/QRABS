package com.ensaoSquad.backend.service;

import com.ensaoSquad.backend.dto.ModuleDTO;
import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.model.Professor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ModuleService {
    ModuleDTO createModule(ModuleDTO moduleDto);
    List<ModuleDTO> getAllModule();

    void deleteModule(Long moduleId);
    ModuleDTO updateModule(Long moduleId, ModuleDTO moduleDto);
    ModuleDTO findModuleByName(String name);
    ModuleDTO findModuleById(long id) ;
    ModuleDTO getCurrentModule(long id);

    List<ModuleDTO> getModulesByProfessor(Professor professor);
    List<ModuleDTO> getModulesByLevel(Level level);
    List<ModuleDTO> getModulesByDepartmentName(String departmentName);
    List<ModuleDTO> getModulesByLevelName(String levelName);

    List<ModuleDTO> uploadByExcel(MultipartFile file);

    void uploadRespoModule(MultipartFile file);

    Module findById(Long moduleId);

    int getNombreDeSeancesPourModule(Module module);
    int getNombreTotalAbsencesPourModule(Module module);

    int countStudentsInLevel(Module module);


    ModuleDTO findByModuleNameAndLevelName(String moduleName, Level level);
}
