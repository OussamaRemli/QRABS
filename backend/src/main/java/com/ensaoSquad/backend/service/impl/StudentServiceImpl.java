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
import org.springframework.transaction.annotation.Transactional;
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
    @Transactional
    public List<StudentDTO> uploadStudentsFromExcel(MultipartFile file) {
        List<StudentDTO> uploadedStudents = new ArrayList<>();
        try {
            Workbook workbook = WorkbookFactory.create(file.getInputStream());
            Sheet sheet = workbook.getSheetAt(0); //only one sheet

            // Get level name from the fourth row, seventh column
            Row headerRow = sheet.getRow(3); // 4th row
            String levelName = headerRow.getCell(2).getStringCellValue();

            // Find the level based on the level name in the Excel
            Level level = levelRepository.findByLevelName(levelName);
            if (level == null) {
                // If level does not exist, you can handle this scenario
                // e.g., throw an exception or log a warning
                throw new RessourceNotFoundException("Le niveau " + levelName + " n'existe pas");
            }

            Iterator<Row> rowIterator = sheet.iterator();
            // Skip header rows to achieve values
            for (int i = 0; i < 2; i++) {
                rowIterator.next();
            }
            //delete all students of the level from database before inserting the new ones
            deleteAllStudentsByLevel(levelName);


            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                if(row.getCell(2).getNumericCellValue() == 0) break;
                StudentDTO studentDTO = new StudentDTO();
                studentDTO.setApogee((long) row.getCell(2).getNumericCellValue());
                studentDTO.setFirstName(row.getCell(4).getStringCellValue());
                studentDTO.setLastName(row.getCell(3).getStringCellValue());
                studentDTO.setEmail(row.getCell(5).getStringCellValue());
                studentDTO.setGroupName(row.getCell(6).getStringCellValue());


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

    @Override
    public List<StudentDTO> getStudentsByLevelName(String levelName) {
        return studentRepository.findByLevelName(levelName)
                .stream().map(StudentMapper::toDTO).toList();
    }

    @Override
    public void deleteAllStudentsByLevel(String levelName) {
        Level level = levelRepository.findByLevelName(levelName);
        if (level != null) {
            studentRepository.deleteByLevel(level);
        } else {
            // Handle the case when the level does not exist
            throw new RessourceNotFoundException("Le niveau " + levelName + " n'existe pas");
        }
    }


}

