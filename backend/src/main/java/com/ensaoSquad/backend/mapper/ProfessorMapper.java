package com.ensaoSquad.backend.mapper;

import com.ensaoSquad.backend.dto.ProfessorDTO;
import com.ensaoSquad.backend.model.Professor;
import org.springframework.stereotype.Component;

@Component
public class ProfessorMapper {

    public ProfessorDTO toDto(Professor professor) {
        ProfessorDTO dto = new ProfessorDTO();
        dto.setProfessorId(professor.getProfessorId());
        dto.setFirstName(professor.getFirstName());
        dto.setLastName(professor.getLastName());
        dto.setEmail(professor.getEmail());
        dto.setPassword(professor.getPassword());
        // Assurez-vous d'avoir un mapper pour Department également
        dto.setDepartment(DepartmentMapper.toDTO(professor.getDepartment()));
        return dto;
    }

    public Professor toEntity(ProfessorDTO professorDto) {
        Professor professor = new Professor();
        professor.setProfessorId(professorDto.getProfessorId());
        professor.setFirstName(professorDto.getFirstName());
        professor.setLastName(professorDto.getLastName());
        professor.setEmail(professorDto.getEmail());
        professor.setPassword(professorDto.getPassword());
        // Assurez-vous d'avoir un mapper pour Department également
        professor.setDepartment(DepartmentMapper.toEntity(professorDto.getDepartment()));
        return professor;
    }
}
