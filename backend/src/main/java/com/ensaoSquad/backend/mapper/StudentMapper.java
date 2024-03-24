package com.ensaoSquad.backend.mapper;

import com.ensaoSquad.backend.dto.StudentDTO;
import com.ensaoSquad.backend.model.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public static StudentDTO toDTO(Student student) {
        StudentDTO studentDTO = new StudentDTO();
        studentDTO.setApogee(student.getApogee());
        studentDTO.setFirstName(student.getFirstName());
        studentDTO.setLastName(student.getLastName());
        studentDTO.setEmail(student.getEmail());
        studentDTO.setGroupName(student.getGroupName());
        return studentDTO;
    }

    public static Student toEntity(StudentDTO studentDTO) {
        Student student = new Student();
        student.setApogee(studentDTO.getApogee());
        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        student.setEmail(studentDTO.getEmail());
        student.setGroupName(studentDTO.getGroupName());
        return student;
    }
}
