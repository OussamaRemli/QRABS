package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.repository.DepartmentRepository;
import com.ensaoSquad.backend.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Check if the department "Administration" exists
        Optional<Department> adminDepartmentOpt = departmentRepository.findByDepartmentName("Administration");
        Department adminDepartment;

        if (adminDepartmentOpt.isEmpty()) {
            // Create "Administration" department if it does not exist
            adminDepartment = new Department();
            adminDepartment.setDepartmentName("Administration");
            adminDepartment = departmentRepository.save(adminDepartment);
        } else {
            adminDepartment = adminDepartmentOpt.get();
        }

        // Check if the admin professor exists
        Optional<Professor> adminProfessorOpt = professorRepository.findByRole("ROLE_ADMIN");
        if (adminProfessorOpt.isEmpty()) {
            // Create admin professor if it does not exist
            Professor adminProfessor = new Professor();
            adminProfessor.setFirstName("admin");
            adminProfessor.setLastName("admin");
            adminProfessor.setEmail("admin@gmail.com");
            adminProfessor.setPassword(passwordEncoder.encode("12345"));
            adminProfessor.setRole("ROLE_ADMIN");
            adminProfessor.setDepartment(adminDepartment);
            professorRepository.save(adminProfessor);
        }
    }
}

