package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.dto.DepartmentDTO;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.mapper.DepartmentMapper;
import com.ensaoSquad.backend.repository.DepartmentRepository;
import com.ensaoSquad.backend.service.DepartmentService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    @Autowired
    private final DepartmentRepository repo;
    @Override
    public DepartmentDTO createDepartment(DepartmentDTO departmentDTO) {
        Department department = DepartmentMapper.toEntity(departmentDTO);
        Department savedDepartment = repo.save(department);
        return DepartmentMapper.toDTO(savedDepartment);
    }

    @Override
    public List<DepartmentDTO> getAllDepartment() {
        List<DepartmentDTO> departmentDTOList = repo.findAll()
                .stream().map(DepartmentMapper::toDTO).toList();
        if(departmentDTOList.isEmpty()){
            throw new RessourceNotFoundException("Il n'y a pas de departement");
        }
        return departmentDTOList;
    }

    @Override
    public DepartmentDTO findDepartmentByName(String name) {
        Department department = repo.findByDepartmentName(name).orElseThrow(() ->
           new RessourceNotFoundException("Departement: "+name+" n'existe pas")
        );
        return DepartmentMapper.toDTO(department);
    }
    @Override
    public DepartmentDTO findDepartmentById(long id) {
        Department department = repo.findByDepartmentId(id).orElseThrow(() ->
                new RessourceNotFoundException("Departement avec l'Id: "+id+" n'existe pas")
        );
        return DepartmentMapper.toDTO(department);
    }




}
