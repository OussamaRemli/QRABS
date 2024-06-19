package com.ensaoSquad.backend.service;

import com.ensaoSquad.backend.dto.StudentDTO;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.model.Student;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.sql.Time;
import java.util.List;

public interface StudentService {
    List<StudentDTO> uploadStudentsFromExcel(MultipartFile file);
    List<StudentDTO> getStudentsByLevelName(String levelName);

    List<StudentDTO> getStudentsByLevelNameAndGroupName(String levelName,String groupName);

    public boolean anyStudentsExist();
    void deleteAllStudentsByLevel(String levelName);

    Student findByApogee(long apogee);


    List<List<StudentDTO>> getStudentsTaughtByProfessorInTimeframe(
            String professorEmail, String sessionDay, Time startTime, Time endTime
    );
    
    void deleteAllStudent();

    boolean apogeeExists(long apogee);
    boolean emailExists(String email);
}
