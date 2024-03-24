package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session,Long> {
}
