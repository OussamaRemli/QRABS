package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.dto.ProfessorDTO;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.exception.UploadExcelException;
import com.ensaoSquad.backend.mapper.DepartmentMapper;
import com.ensaoSquad.backend.mapper.ProfessorMapper;
import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.repository.DepartmentRepository;
import com.ensaoSquad.backend.repository.ProfessorRepository;
import com.ensaoSquad.backend.service.ProfessorService;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProfessorServiceImpl implements ProfessorService {

    @Autowired
    private final ProfessorRepository professorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private final DepartmentRepository departmentRepository;



    @Override
    public ProfessorDTO save(ProfessorDTO professorDto) {
        Professor professor = ProfessorMapper.toEntity(professorDto);
        professor.setPassword(passwordEncoder.encode(professor.getPassword()));
        professor = professorRepository.save(professor);
        return ProfessorMapper.toDTO(professor);
    }

    @Override
    public List<ProfessorDTO> saveByExcel(MultipartFile file) {
        List<ProfessorDTO> savedProfs = new ArrayList<>();
        try {
            Workbook workbook = WorkbookFactory.create(file.getInputStream());
            Sheet sheet = workbook.getSheetAt(0); // Only one sheet

            Iterator<Row> rowIterator = sheet.iterator();
            rowIterator.next();

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                ProfessorDTO professorDTO = new ProfessorDTO();

                // Extracting values from columns F, G, H, and I
                String departmentName = getMergedCellValue(sheet, row.getRowNum(), 5); // Column F (0-indexed)
                // Check if the department exists
                Department department;
                Optional<Department> optionalDepartment = departmentRepository.findByDepartmentName(departmentName);
                if (optionalDepartment.isPresent()) {
                    department = optionalDepartment.get();
                } else {
                    throw new RessourceNotFoundException("Department not found: " + departmentName);
                }

                //if professor exists do not inserted to database
                Optional<Professor> professorExist = professorRepository.findByEmail(row.getCell(8).getStringCellValue());
                if(professorExist.isPresent()) continue;

                professorDTO.setLastName(row.getCell(6).getStringCellValue()); // Column G (0-indexed)
                professorDTO.setFirstName(row.getCell(7).getStringCellValue()); // Column H (0-indexed)
                professorDTO.setEmail(row.getCell(8).getStringCellValue()); // Column I (0-indexed)
                professorDTO.setPassword(passwordEncoder.encode("12345")); // Assuming a default password
                professorDTO.setDepartment(DepartmentMapper.toDTO(department));

                // Map DTO to entity
                Professor prof = ProfessorMapper.toEntity(professorDTO);
                // Save professor entity
                prof = professorRepository.save(prof);

                // Map entity back to DTO and add to list
                savedProfs.add(ProfessorMapper.toDTO(prof));
            }
            workbook.close();
        } catch (IOException e) {
            e.printStackTrace();
            // Handle exception properly
        }
        return savedProfs;
    }

    //to get departement cell ; its a merged of multiple cells
    private String getMergedCellValue(Sheet sheet, int rowNum, int cellNum) {
        for (CellRangeAddress range : sheet.getMergedRegions()) {
            if (range.isInRange(rowNum, cellNum)) {
                return sheet.getRow(range.getFirstRow()).getCell(range.getFirstColumn()).getStringCellValue();
            }
        }
        return sheet.getRow(rowNum).getCell(cellNum).getStringCellValue();
    }


    @Override
    public List<ProfessorDTO> findAll() {
        return professorRepository.findAll()
                .stream()
                .map(ProfessorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProfessorDTO findById(Long id) {
        Professor professor = professorRepository.findById(id).orElseThrow(() -> new RuntimeException("Professor not found with id: "+id));
        return professor != null ? ProfessorMapper.toDTO(professor) : null;
    }

    @Override
    public ProfessorDTO findByName(String lastName) {
        Professor professor = professorRepository.findByLastName(lastName).orElse(null);
        return professor != null ? ProfessorMapper.toDTO(professor) : null;    }

    @Override
    public Optional<ProfessorDTO> findByEmail(String email) {
        Optional<Professor> optionalProfessor = professorRepository.findByEmail(email);
        return optionalProfessor.map(ProfessorMapper::toDTO);
    }


    @Override
    public List<ProfessorDTO> findByDepartmentName(String departmentName) {
        List<Professor> professors = professorRepository.findByDepartmentDepartmentName(departmentName);
        return professors.stream()
                .map(ProfessorMapper::toDTO)
                .collect(Collectors.toList());
    }


    @Override
    public void delete(Long id) {
        professorRepository.deleteById(id);
    }

    @Override
    public ProfessorDTO update(ProfessorDTO professorDTO){
        Professor existingProfessor=ProfessorMapper.toEntity(professorDTO);
         existingProfessor = professorRepository.findById(professorDTO.getProfessorId())
                .orElseThrow(() -> new RuntimeException("Professor not found"));
        existingProfessor.setFirstName(professorDTO.getFirstName());
        existingProfessor.setLastName(professorDTO.getLastName());
        existingProfessor.setEmail(professorDTO.getEmail());
        existingProfessor.setDepartment(DepartmentMapper.toEntity(professorDTO.getDepartment()));

        // Encode the new password if it's not empty
        if (!professorDTO.getPassword().isEmpty()) {
            existingProfessor.setPassword(passwordEncoder.encode(professorDTO.getPassword()));
        }
        existingProfessor= professorRepository.save(existingProfessor);
        return ProfessorMapper.toDTO(existingProfessor);
    }
}