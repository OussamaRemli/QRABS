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
        // Initialize departments
        initializeDepartment("Administration");
        initializeDepartment("Département d'Electronique Informatique et Télécommunications");
        initializeDepartment("Département de Mécanique et Mathématiques appliquées");
        initializeDepartment("Département des Humanités et Management");

        // Check if the admin professor exists
        Optional<Professor> adminProfessorOpt = professorRepository.findByRole("ROLE_ADMIN");
        if (adminProfessorOpt.isEmpty()) {
            // Create admin professor if it does not exist
            Optional<Department> adminDepartmentOpt = departmentRepository.findByDepartmentName("Administration");
            Department adminDepartment = adminDepartmentOpt.orElseThrow(() -> new RuntimeException("Administration department not found"));

            Professor adminProfessor = new Professor();
            adminProfessor.setFirstName("admin");
            adminProfessor.setLastName("admin");
            adminProfessor.setEmail("QRABSENSAO@gmail.com");
            adminProfessor.setPassword(passwordEncoder.encode("QRABSENSaO@_2000"));
            adminProfessor.setRole("ROLE_ADMIN");
            adminProfessor.setDepartment(adminDepartment);
            professorRepository.save(adminProfessor);
        }
    }

    private void initializeDepartment(String departmentName) {
        Optional<Department> departmentOpt = departmentRepository.findByDepartmentName(departmentName);
        if (departmentOpt.isEmpty()) {
            // Create department if it does not exist
            Department department = new Department();
            department.setDepartmentName(departmentName);
            departmentRepository.save(department);
        }
    }
}
