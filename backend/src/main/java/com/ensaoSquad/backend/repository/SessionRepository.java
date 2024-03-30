package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Time;
import java.util.List;

public interface SessionRepository extends JpaRepository<Session ,Long> {
    List<Session> findByProfessorAndSessionDayAndStartTimeGreaterThanEqualAndEndTimeLessThanEqual(
            Professor professor, String sessionDay, Time startTime, Time endTime);
}
