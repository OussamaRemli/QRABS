package com.ensaoSquad.backend.service;

import com.ensaoSquad.backend.dto.DepartmentDTO;

import java.util.List;

public interface DepartmentService {
    DepartmentDTO createDepartment(DepartmentDTO departmentDTO);
    List<DepartmentDTO> getAllDepartment();

    DepartmentDTO findDepartmentByName(String name);
}
