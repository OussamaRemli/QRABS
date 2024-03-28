package com.ensaoSquad.backend.mapper;

import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.dto.DepartmentDTO;
import org.springframework.stereotype.Component;

public class DepartmentMapper {

    // Method to map from Department entity to DepartmentDTO
    public static DepartmentDTO toDTO(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setDepartmentId(department.getDepartmentId());
        dto.setDepartmentName(department.getDepartmentName());
        return dto;
    }

    // Method to map from DepartmentDTO to Department entity
    public static Department toEntity(DepartmentDTO dto) {
        Department department = new Department();
        department.setDepartmentId(dto.getDepartmentId());
        department.setDepartmentName(dto.getDepartmentName());
        return department;
    }
}
