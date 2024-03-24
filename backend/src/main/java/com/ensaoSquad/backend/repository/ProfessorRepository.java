package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
}

