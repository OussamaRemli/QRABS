package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthRepository extends JpaRepository<Professor, Long> {
    Professor findByEmail(String email);
    Professor findByProfessorId(Long id);
}
