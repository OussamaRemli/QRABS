package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.dto.LevelDTO;
import com.ensaoSquad.backend.dto.StudentDTO;
import com.ensaoSquad.backend.Model.Level;
import com.ensaoSquad.backend.Model.Student;
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

            Iterator<Row> rowIterator = sheet.iterator();
            rowIterator.next(); // Skip header row

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                StudentDTO studentDTO = new StudentDTO();
                studentDTO.setApogee((long) row.getCell(0).getNumericCellValue());
                studentDTO.setFirstName(row.getCell(1).getStringCellValue());
                studentDTO.setLastName(row.getCell(2).getStringCellValue());
                studentDTO.setEmail(row.getCell(3).getStringCellValue());
                studentDTO.setGroupName(row.getCell(4).getStringCellValue());

                String levelName = row.getCell(5).getStringCellValue();
                String sectorName = row.getCell(6).getStringCellValue();
                Level level = levelRepository.findByLevelNameAndSectorName(levelName, sectorName);
                if (level == null) {
                    level = new Level();
                    level.setLevelName(levelName);
                    level.setSectorName(sectorName);
                    level = levelRepository.save(level);
                }
                studentDTO.setLevel(new LevelDTO(level.getLevelId(), level.getLevelName(), level.getSectorName()));

                Student student = new Student();
                student.setApogee(studentDTO.getApogee());
                student.setFirstName(studentDTO.getFirstName());
                student.setLastName(studentDTO.getLastName());
                student.setEmail(studentDTO.getEmail());
                student.setGroupName(studentDTO.getGroupName());
                student.setLevel(level);
                student = studentRepository.save(student);

                uploadedStudents.add(studentDTO);
            }
            workbook.close();
        } catch (IOException e) {
            e.printStackTrace();
            // Handle exception
        }
        return uploadedStudents;
    }
}
