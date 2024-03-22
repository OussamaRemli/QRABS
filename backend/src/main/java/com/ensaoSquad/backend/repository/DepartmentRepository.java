package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.Model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    Optional<Department> findByDepartmentName(String name);
}
