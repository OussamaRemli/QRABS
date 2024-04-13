package com.ensaoSquad.backend.mapper;

import com.ensaoSquad.backend.dto.ProfessorDTO;
import com.ensaoSquad.backend.model.Professor;
import org.springframework.stereotype.Component;

@Component
public class ProfessorMapper {

    public static ProfessorDTO toDTO(Professor professor) {
        ProfessorDTO dto = new ProfessorDTO();
        dto.setProfessorId(professor.getProfessorId());
        dto.setFirstName(professor.getFirstName());
        dto.setLastName(professor.getLastName());
        dto.setEmail(professor.getEmail());
        dto.setPassword(professor.getPassword());
        dto.setRole(professor.getRole());
        dto.setDepartment(DepartmentMapper.toDTO(professor.getDepartment()));
        return dto;
    }

    public static Professor toEntity(ProfessorDTO professorDto) {
        Professor professor = new Professor();
        professor.setProfessorId(professorDto.getProfessorId());
        professor.setFirstName(professorDto.getFirstName());
        professor.setLastName(professorDto.getLastName());
        professor.setEmail(professorDto.getEmail());
        professor.setPassword(professorDto.getPassword());
        professor.setRole(professorDto.getRole());
        professor.setDepartment(DepartmentMapper.toEntity(professorDto.getDepartment()));
        return professor;
    }
}
