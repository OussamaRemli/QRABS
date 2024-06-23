package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.dto.ProfessorDTO;
import com.ensaoSquad.backend.exception.DuplicateException;
import com.ensaoSquad.backend.exception.ProfessorNotFoundException;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.exception.UploadExcelException;
import com.ensaoSquad.backend.mapper.DepartmentMapper;
import com.ensaoSquad.backend.mapper.ProfessorMapper;
import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.repository.DepartmentRepository;
import com.ensaoSquad.backend.repository.ProfessorRepository;
import com.ensaoSquad.backend.service.ProfessorService;
import jakarta.persistence.NonUniqueResultException;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
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
        Set<String> gmailAddresses = new HashSet<>();
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

                ProfessorDTO professorDTO = new ProfessorDTO();

                // Extracting values from columns F, G, H, and I

                String departmentName = getMergedCellValue(sheet, row.getRowNum(), 6 ); // Column F (1-indexed)
                // Check if the department exists
                Optional<Department> departmentOptional = departmentRepository.findByDepartmentName(departmentName);
                Department department;
                if (departmentOptional.isPresent()) {
                    department = departmentOptional.get();
                } else {
                    throw new RessourceNotFoundException("Departement: " + departmentName + " n'existe pas.");
                }
                String email = row.getCell(9).getStringCellValue(); // Column I (1-indexed)

                // Check if the Gmail address occurs more than once
//                if (gmailAddresses.add(email)) {
//                    throw new DuplicateException("le gmail: " + email +" existe plusieurs fois");
//                }

                // Check if professor with the same email already exists in the database
                if (professorRepository.findByEmail(email).isPresent()) {
                    continue; // Skip inserting the professor into the database
                }

                // Map other data
                professorDTO.setLastName(row.getCell(7).getStringCellValue()); // Column G (0-indexed)
                professorDTO.setFirstName(row.getCell(8).getStringCellValue()); // Column H (0-indexed)
                professorDTO.setEmail(email);
                professorDTO.setPassword(passwordEncoder.encode("12345")); // Assuming a default password
                professorDTO.setDepartment(DepartmentMapper.toDTO(department));

                // Map DTO to entity and save
                Professor prof = ProfessorMapper.toEntity(professorDTO);
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
        try {
            Professor existingProfessor = ProfessorMapper.toEntity(professorDTO);
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
            existingProfessor = professorRepository.save(existingProfessor);
            return ProfessorMapper.toDTO(existingProfessor);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Cet email est déjà associé à un autre professeur.");
        }
    }

    @Override
    public List<Professor> findByFirstNameAndLastName(String firstName, String lastName) {
            return professorRepository.findByFirstNameAndLastName(firstName, lastName);

    }


    public void updateEmail(Long professorId, String newEmail) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new ProfessorNotFoundException("Professor not found"));

        professor.setEmail(newEmail);
        professorRepository.save(professor);
    }

    public void updatePassword(Long professorId, String newPassword) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new ProfessorNotFoundException("Professor not found"));

        // Validate the new password (you can add more complex validation logic)
        if (newPassword == null || newPassword.isEmpty()) {
            throw new IllegalArgumentException("New password cannot be null or empty");
        }

        // Hash the new password
        String encodedPassword = passwordEncoder.encode(newPassword);

        // Set the new hashed password
        professor.setPassword(encodedPassword);

        // Save the professor with the updated password
        professorRepository.save(professor);
    }
}