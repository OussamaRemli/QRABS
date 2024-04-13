package com.ensaoSquad.backend.service;

import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.dto.DepartmentDTO;
import com.ensaoSquad.backend.dto.LoginDTO;
import com.ensaoSquad.backend.repository.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

public interface DepartmentService {
    DepartmentDTO createDepartment(DepartmentDTO departmentDTO);
    List<DepartmentDTO> getAllDepartment();

    DepartmentDTO findDepartmentByName(String name);
    DepartmentDTO findDepartmentById(long id);

}
