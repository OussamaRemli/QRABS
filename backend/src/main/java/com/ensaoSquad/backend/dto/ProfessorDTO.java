package com.ensaoSquad.backend.dto;
import com.ensaoSquad.backend.dto.DepartmentDTO;
import lombok.Data;

@Data
public class ProfessorDTO {
    private long professorId;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role = "ROLE_PROFESSOR";
    private DepartmentDTO department;
}


