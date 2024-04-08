package com.ensaoSquad.backend.service.impl;


import com.ensaoSquad.backend.dto.ProfessorDTO;
import com.ensaoSquad.backend.mapper.ProfessorMapper;
import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.dto.ModuleDTO;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.mapper.ModuleMapper;

import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.repository.DepartmentRepository;
import com.ensaoSquad.backend.repository.LevelRepository;
import com.ensaoSquad.backend.repository.ModuleRepository;
import com.ensaoSquad.backend.service.ModuleService;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
@AllArgsConstructor
public class ModuleServiceImp implements ModuleService {


    private final ModuleRepository moduleRepository;
    private final DepartmentRepository departmentRepository;
    private final LevelRepository levelRepository;


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
        return null;
    }

    @Override
    public List<ModuleDTO> getModulesByProfessor(Professor professor) {
        List<Module> modules = moduleRepository.findByProfessor(professor);
        if (modules.isEmpty()) {
            throw new RessourceNotFoundException("No modules found for professor: " + professor.getFirstName());
        }

        return modules.stream()
                .map(ModuleMapper::toDTO)
                .toList();
    }


    @Override
    public List<ModuleDTO> getModulesByLevel(Level level) {
        List<Module> modules = moduleRepository.findByLevel(level);
        if (modules.isEmpty()) {
            throw new RessourceNotFoundException("No modules found for level: " + level.getLevelName());
        }

        return modules.stream()
                .map(ModuleMapper::toDTO)
                .toList();
    }


    @Override
    public List<ModuleDTO> getModulesByDepartmentName(String departmentName) {
        Department department = departmentRepository.findByDepartmentName(departmentName)
                .orElseThrow(() -> new RessourceNotFoundException("Department not found with name: " + departmentName));
        List<Module> modules = moduleRepository.findByDepartmentDepartmentName(departmentName);
        if (modules.isEmpty()) {
            throw new RessourceNotFoundException("No modules found for department: " + departmentName);
        }
        return modules.stream()
                .map(ModuleMapper::toDTO)
                .toList();
    }


    @Override
    public List<ModuleDTO> uploadByExcel(MultipartFile file) {
        List<ModuleDTO> savedModules = new ArrayList<>();
        try {
            Workbook workbook = WorkbookFactory.create(file.getInputStream());
            Sheet sheet = workbook.getSheetAt(0); // Only one sheet

            Iterator<Row> rowIterator = sheet.iterator();
            rowIterator.next();

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                ModuleDTO moduleDTO = new ModuleDTO();

                //get merged cells
                String departmentName = getMergedCellValue(sheet, row.getRowNum(), 3);
                String filiere = getMergedCellValue(sheet, row.getRowNum(), 4);
                String semestre = getMergedCellValue(sheet, row.getRowNum(), 5);

                //get ordinary cells
                moduleDTO.setIntituleModule(getMergedCellValue(sheet, row.getRowNum(), 6));
                moduleDTO.setModuleName(row.getCell(7).getStringCellValue());
                moduleDTO.setNameByDepartment(row.getCell(8).getStringCellValue());

                // Map DTO to entity
                Module module = ModuleMapper.toEntity(moduleDTO);

                // Find or create department
                Department department = departmentRepository
                        .findByDepartmentName(departmentName)
                        .orElseGet(() -> {
                            Department newDepartment = new Department();
                            newDepartment.setDepartmentName(departmentName);
                            return departmentRepository.save(newDepartment);
                        });
                module.setDepartment(department);

                //find level
                List<Level> levels = levelRepository.findBySectorName(filiere);
                List<String> levelsName = levels.stream().map(level -> level.getLevelName()).toList();
                String levelName = "";
                if(semestre.equalsIgnoreCase("s1") ||
                        semestre.equalsIgnoreCase("s2")){
                    for(String l:levelsName){
                        if(l.charAt(l.length()-1) == '3') levelName = l;
                    }
                }
                if(semestre.equalsIgnoreCase("s3") ||
                        semestre.equalsIgnoreCase("s4")){
                    for(String l:levelsName){
                        if(l.charAt(l.length()-1) == '4') levelName = l;
                    }
                }
                if(semestre.equalsIgnoreCase("s5")){
                    for(String l:levelsName){
                        if(l.charAt(l.length()-1) == '5') levelName = l;
                    }
                }
                Level level = levelRepository.findByLevelName(levelName);

                module.setLevel(level);
                // Save module entity
                module = moduleRepository.save(module);

                // Map entity back to DTO and add to list
                savedModules.add(ModuleMapper.toDTO(module));
            }
            workbook.close();
        } catch (IOException e) {
            e.printStackTrace();
            // Handle exception properly
        }
        return savedModules;
    }

    private String getMergedCellValue(Sheet sheet, int rowNum, int cellNum) {
        for (CellRangeAddress range : sheet.getMergedRegions()) {
            if (range.isInRange(rowNum, cellNum)) {
                return sheet.getRow(range.getFirstRow()).getCell(range.getFirstColumn()).getStringCellValue();
            }
        }
        return sheet.getRow(rowNum).getCell(cellNum).getStringCellValue();
    }

}