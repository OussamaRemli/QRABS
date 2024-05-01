package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.dto.StudentDTO;
import com.ensaoSquad.backend.exception.UploadExcelException;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.model.Session;
import com.ensaoSquad.backend.model.Student;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.mapper.StudentMapper;
import com.ensaoSquad.backend.repository.LevelRepository;
import com.ensaoSquad.backend.repository.ProfessorRepository;
import com.ensaoSquad.backend.repository.SessionRepository;
import com.ensaoSquad.backend.repository.StudentRepository;
import com.ensaoSquad.backend.service.StudentService;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Time;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private LevelRepository levelRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private ProfessorRepository professorRepository;

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
                throw new RessourceNotFoundException("Le niveau " + levelName + " n'existe pas");
            }

            //if the students already exists in database they shoudln't be inserted
            // that's will cause some errors like uniq contstraint for emails duplicated
            if (studentRepository.existsStudentByLevel(level)) {
                throw new UploadExcelException("Des étudiants existent déjà pour ce niveau. Impossible de charger de nouveaux étudiants.");
            }

            Iterator<Row> rowIterator = sheet.iterator();
            // Skip header rows to achieve values
            for (int i = 0; i < 2; i++) {
                rowIterator.next();
            }

            int rowNum = 6; // Starting row number

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                if(row.getCell(2).getNumericCellValue() == 0) break;
                if (row.getCell(4).getCellType() == CellType.BLANK ||
                        row.getCell(3).getCellType() == CellType.BLANK ||
                        row.getCell(5).getCellType() == CellType.BLANK ||
                        row.getCell(6).getCellType() == CellType.BLANK) {
                    throw new UploadExcelException("Une cellule obligatoire est manquante dans la ligne " + rowNum + "." +
                            " Veuillez vérifier que toutes les cellules requises sont remplies.");
                }

                StudentDTO studentDTO = new StudentDTO();
                studentDTO.setApogee((long) row.getCell(2).getNumericCellValue());
                studentDTO.setFirstName(row.getCell(4).getStringCellValue());
                studentDTO.setLastName(row.getCell(3).getStringCellValue());
                studentDTO.setEmail(row.getCell(5).getStringCellValue());
                studentDTO.setGroupName(row.getCell(6).getStringCellValue());


                Student student = StudentMapper.toEntity(studentDTO);
                student.setLevel(level);

                student = studentRepository.save(student);

                uploadedStudents.add(StudentMapper.toDTO(student));
                rowNum++;
            }
            workbook.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return uploadedStudents;
    }

    @Override
    public List<StudentDTO> getStudentsByLevelName(String levelName) {
        return studentRepository.findByLevelLevelName(levelName)
                .stream().map(StudentMapper::toDTO).toList();
    }

    @Override
    public List<StudentDTO> getStudentsByLevelNameAndGroupName(String levelName, String groupName) {
        return studentRepository.findByLevelNameAndGroupName(levelName,groupName)
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

    @Override
    public Student findByApogee(long apogee) {
        return studentRepository.findByApogee(apogee);
    }

    @Override
    public List<List<StudentDTO>> getStudentsTaughtByProfessorInTimeframe(
            String professorEmail, String sessionDay, Time startTime, Time endTime) {
        Professor professor = professorRepository.findByEmail(professorEmail).orElseThrow(
                () -> new RessourceNotFoundException("Email not found")
        );
        List<Session> sessions = sessionRepository
                .findByProfessorAndSessionDayAndStartTimeGreaterThanEqualAndEndTimeLessThanEqual(
                        professor, sessionDay, startTime, endTime);
        List<List<StudentDTO>> students = sessions.stream().map(s -> getStudentsByLevelName(s.getLevel().getLevelName())).toList();
        return students;
    }

}

