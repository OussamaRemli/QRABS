package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> findByFirstNameAndLastName(String firstName,String lastName);
    Optional<Professor> findByLastName(String lastName);
    Optional<Professor> findByEmail(String email);
    List<Professor> findByDepartmentDepartmentName(String departmentName);
    long count();

}

