package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.dto.DepartmentDTO;
import com.ensaoSquad.backend.service.DepartmentService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/departments","/api/departments/"})
@AllArgsConstructor
public class DepartmentController {
    @Autowired
    private final DepartmentService service;
    @PostMapping
    public ResponseEntity<DepartmentDTO> createDepartment(@RequestBody DepartmentDTO departmentDTO){


        DepartmentDTO departmentDtoCreated = service.createDepartment(departmentDTO);
        return new ResponseEntity<>(departmentDtoCreated, HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<DepartmentDTO>> getAllDepartment(){
        return ResponseEntity.ok(service.getAllDepartment());
    }

    @GetMapping("/{name}")
    public ResponseEntity<DepartmentDTO> getDepartmentByName(@PathVariable String name){
        return ResponseEntity.ok(service.findDepartmentByName(name));
    }
    @GetMapping("/id/{id}")
    public ResponseEntity<DepartmentDTO> getDepartmentById(@PathVariable long id){
        return ResponseEntity.ok(service.findDepartmentById(id));
    }
}
