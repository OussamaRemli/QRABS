package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Time;
import java.util.List;

public interface SessionRepository extends JpaRepository<Session ,Long> {
    List<Session> findByProfessorAndSessionDayAndStartTimeGreaterThanEqualAndEndTimeLessThanEqual(
            Professor professor, String sessionDay, Time startTime, Time endTime);

    @Modifying
    @Query("DELETE FROM Session s WHERE s.level = :level")
    void deleteByLevel(@Param("level") Level level);



     // retouner le  id du module á partir la séance actuelle  du professeur
    @Query("SELECT s.module.moduleId FROM Session s WHERE s.professor.professorId = :professorId " +
            "AND s.sessionDay = :currentDay " +
            "AND :currentTime BETWEEN s.startTime AND s.endTime")
    Long findModuleIdsByProfessorIdAndCurrentTimeAndDay(long professorId, String currentDay, Time currentTime);
}
