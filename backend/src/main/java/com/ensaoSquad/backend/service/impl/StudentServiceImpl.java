package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.dto.LevelDTO;
import com.ensaoSquad.backend.dto.StudentDTO;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Student;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.mapper.StudentMapper;
import com.ensaoSquad.backend.repository.LevelRepository;
import com.ensaoSquad.backend.repository.StudentRepository;
import com.ensaoSquad.backend.service.StudentService;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private LevelRepository levelRepository;

    @Override
    public List<StudentDTO> uploadStudentsFromExcel(MultipartFile file) {
        List<StudentDTO> uploadedStudents = new ArrayList<>();
        try {
            Workbook workbook = WorkbookFactory.create(file.getInputStream());
            Sheet sheet = workbook.getSheetAt(0); //only one sheet

            // Get level name from the first row, third column
            Row headerRow = sheet.getRow(0);
            String levelName = headerRow.getCell(2).getStringCellValue(); // Assuming levelName is in the third column (index 2)

            // Find the level based on the level name in the Excel
            Level level = levelRepository.findByLevelName(levelName);
            if (level == null) {
                // If level does not exist, you can handle this scenario
                // e.g., throw an exception or log a warning
                throw new RessourceNotFoundException("Le niveau " + levelName + " n'existe pas");
            }

            Iterator<Row> rowIterator = sheet.iterator();
            // Skip header 2 row to achieve values
            rowIterator.next();
            rowIterator.next();

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                StudentDTO studentDTO = new StudentDTO();
                studentDTO.setApogee((long) row.getCell(0).getNumericCellValue());
                studentDTO.setFirstName(row.getCell(1).getStringCellValue());
                studentDTO.setLastName(row.getCell(2).getStringCellValue());
                studentDTO.setEmail(row.getCell(3).getStringCellValue());
                studentDTO.setGroupName(row.getCell(4).getStringCellValue());

                Student student = StudentMapper.toEntity(studentDTO);
                student.setLevel(level);

                student = studentRepository.save(student);

                uploadedStudents.add(StudentMapper.toDTO(student));            }
            workbook.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return uploadedStudents;
    }

}

