package com.ensaoSquad.backend.service.impl;


import com.ensaoSquad.backend.model.*;
import com.ensaoSquad.backend.dto.ModuleDTO;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.mapper.ModuleMapper;

import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.repository.*;
import com.ensaoSquad.backend.service.ModuleService;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ModuleServiceImp implements ModuleService {


    private final ModuleRepository moduleRepository;
    private final DepartmentRepository departmentRepository;
    private final LevelRepository levelRepository;
    private final ProfessorRepository professorRepository;
    private final SessionRepository sessionRepository;
    private final AbsenceRepository absenceRepository;
    private final StudentRepository studentRepository;


    @Override
    public ModuleDTO createModule(ModuleDTO moduleDto) {
        boolean moduleExists = moduleRepository.existsByModuleNameAndLevel_LevelId(moduleDto.getModuleName(), moduleDto.getLevel().getLevelId());

        // Si le module existe déjà, déclencher une exception
        if (moduleExists) {
            throw new RuntimeException("Module with the same name and level already exists");
        }

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
    public List<ModuleDTO> getModulesByLevelName(String levelName) {
        Optional<Level> optionalLevel = Optional.of(levelRepository.findByLevelName(levelName));
        Level level = optionalLevel.orElseThrow(() -> new RessourceNotFoundException("Level not found with name: " + levelName));
        List<Module> modules = moduleRepository.findByLevelLevelName(levelName);
        if (modules.isEmpty()) {
            throw new RessourceNotFoundException("No modules found for level: " + levelName);
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
            for (int i = 0; i < 5; i++) { // Skip the first 5 rows
                if (rowIterator.hasNext()) {
                    rowIterator.next();
                }
            }

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                ModuleDTO moduleDTO = new ModuleDTO();

                //get merged cells
                String departmentName = getMergedCellValue(sheet, row.getRowNum(), 3);
                String filiere = getMergedCellValue(sheet, row.getRowNum(), 4);
                if (filiere.isEmpty()){
                    continue;
                }
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
                        .orElseThrow(() -> new RessourceNotFoundException("Le departement " + departmentName + " n'existe pas."));

                module.setDepartment(department);

                //find level
                List<Level> levels = levelRepository.findBySectorName(filiere);

                String targetLevelSuffix = "";

                if (semestre.equalsIgnoreCase("s1") || semestre.equalsIgnoreCase("s2")) {
                    targetLevelSuffix = "3";
                } else if (semestre.equalsIgnoreCase("s3") || semestre.equalsIgnoreCase("s4")) {
                    targetLevelSuffix = "4";
                } else if (semestre.equalsIgnoreCase("s5")|| semestre.equalsIgnoreCase("s6")) {
                    targetLevelSuffix = "5";
                }

                String finalTargetLevelSuffix = targetLevelSuffix;

                String levelName = levels.stream()
                        .map(Level::getLevelName)
                        .filter(name -> name.endsWith(finalTargetLevelSuffix))
                        .findFirst()
                        .orElseThrow(() -> new RessourceNotFoundException("semstre invalide" +semestre+ "dans" +filiere));

                Level level = levelRepository.findByLevelName(levelName);
                if (level == null) {
                    throw new RessourceNotFoundException("le niveau " + levelName + " n'existe pas.");
                }

                if (moduleRepository.existsByModuleNameAndLevel_LevelId(moduleDTO.getModuleName(),level.getLevelId())) {
                    System.out.println("Module name " + moduleDTO.getModuleName() + "with level: "+ levelName +" already exists. Skipping insertion.");
                    continue;
                }

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

    @Override
    public void uploadRespoModule(MultipartFile file) {
        try {
            Workbook workbook = WorkbookFactory.create(file.getInputStream());
            Sheet sheet = workbook.getSheetAt(0); // Only one sheet

            Iterator<Row> rowIterator = sheet.iterator();
            for (int i = 0; i < 6; i++) { // Skip the first 5 rows
                if (rowIterator.hasNext()) {
                    rowIterator.next();
                }
            }

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                if (!isRowEmpty(row)) {
                    // Module Name
                    Cell cellB = row.getCell(5, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    String cellValueB = getCellValueAsString(cellB);

                    // Prof respo
                    Cell cellD = row.getCell(6, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    String cellValueD = getCellValueAsString(cellD);

                    // Level name
                    Cell cellJ = row.getCell(3, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    String cellValueJ = getCellValueAsString(cellJ);

                    Level level = levelRepository.findByLevelName(cellValueJ);
                    if (level == null) {
                        throw new RessourceNotFoundException("Le niveau " + cellValueJ + " n'existe pas.");
                    }

                    Module module = moduleRepository.findByModuleNameAndLevel(cellValueB, level);
                    if (module == null) {
                        throw new RessourceNotFoundException("Le module " + cellValueB + " n'existe pas dans le niveau "+cellValueJ);
                    }

                    Optional<Professor> professorOptional = professorRepository.findByEmail(cellValueD);
                    if (professorOptional.isPresent()) {
                        Professor professor = professorOptional.get();
                        module.setProfessor(professor);
                        moduleRepository.save(module);
                    }else{
                        throw new RessourceNotFoundException("Acun professeur avev l'email " + cellValueD );

                    }
                }
            }
            workbook.close();
        } catch (IOException e) {
            e.printStackTrace();
            // Handle exception properly
        }
    }



    private boolean isRowEmpty(Row row) {
        for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                return false;
            }
        }
        return true;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }

    @Override
    public Module findById(Long moduleId) {
        return moduleRepository.findById(moduleId).orElse(null);
    }
        @Override
        public int getNombreDeSeancesPourModule(Module module) {

            Long absences=sessionRepository.countSessionsByModule(module.getModuleId());


            return Math.toIntExact(absences);
        }

        @Override
        public int getNombreTotalAbsencesPourModule(Module module) {
            List<Session> sessions = sessionRepository.findByModule(module);
            int totalAbsences = 0;
            for (Session session : sessions) {
                totalAbsences += absenceRepository.countBySession(session);
            }
            return totalAbsences;
        }

    @Override
    public int countStudentsInLevel(Module module) {
        Level level=module.getLevel();
        Long i=studentRepository.countStudentsByLevel(level);
        return Math.toIntExact(i);
    }

    @Override
    public ModuleDTO findByModuleNameAndLevelName(String moduleName, Level level) {
        Module module = moduleRepository.findByModuleNameAndLevel(moduleName,level);
              if(module == null) {
                throw   new RessourceNotFoundException("Module: " + moduleName + " n'existe pas dans le niveau "  + level.getLevelName());
              }
        return ModuleMapper.toDTO(module);

    }
}