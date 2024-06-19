package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.dto.ModuleDTO;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session ,Long> {
    List<Session> findByProfessorAndSessionDayAndStartTimeGreaterThanEqualAndEndTimeLessThanEqual(
            Professor professor, String sessionDay, Time startTime, Time endTime);

    Session findBySessionId(long sessionId);

    @Modifying
    @Query("DELETE FROM Session s WHERE s.level = :level")
    void deleteByLevel(@Param("level") Level level);

    @Query("SELECT s FROM Session s WHERE s.level.levelName = :levelName")
    List<Session> findSessionsByLevelName(@Param("levelName") String levelName);


     // retouner le  id du module á partir la séance actuelle  du professeur
    @Query("SELECT s.module.moduleId FROM Session s WHERE s.professor.professorId = :professorId " +
            "AND s.sessionDay = :currentDay " +
            "AND :currentTime BETWEEN s.startTime AND s.endTime")
    Long findModuleIdsByProfessorIdAndCurrentTimeAndDay(long professorId, String currentDay, Time currentTime);

    @Query("SELECT s.level.levelId FROM Session s WHERE s.professor.professorId = :professorId " +
            "AND s.sessionDay = :currentDay " +
            "AND :currentTime BETWEEN s.startTime AND s.endTime")
    List<Long> findLevelIdsByProfessorIdAndCurrentTimeAndDay(long professorId, String currentDay, Time currentTime);

    @Query("SELECT s FROM Session s WHERE s.professor.professorId = :professorId AND s.sessionDay = :currentDay ORDER BY s.startTime ASC")
    List<Session> findSessionsForToday(long professorId, String currentDay);
    @Query("SELECT s FROM Session s WHERE s.professor.professorId = :professorId AND s.sessionDay = :currentDay AND s.startTime > :currentTime ORDER BY s.startTime ASC")
    List<Session> findFutureSessionsForToday(long professorId, String currentDay, LocalTime currentTime);
    @Query("SELECT s FROM Session s WHERE s.professor.professorId = :professorId AND (s.sessionDay != :currentDay OR (s.sessionDay = :currentDay AND s.startTime > :currentTime)) ORDER BY CASE WHEN s.sessionDay = :#{#daysOrder[0]} THEN 0 WHEN s.sessionDay = :#{#daysOrder[1]} THEN 1 WHEN s.sessionDay = :#{#daysOrder[2]} THEN 2 WHEN s.sessionDay = :#{#daysOrder[3]} THEN 3 WHEN s.sessionDay = :#{#daysOrder[4]} THEN 4 WHEN s.sessionDay = :#{#daysOrder[5]} THEN 5 ELSE 6 END, s.startTime ASC")
    List<Session> findNextSessionForProfessor(long professorId, List<String> daysOrder, String currentDay, LocalTime currentTime);















    @Query("SELECT s FROM Session s WHERE s.sessionDay = :currentDay AND :currentTime BETWEEN s.startTime AND s.endTime AND s.professor.professorId= :professorId")
    List<Session> findSessionForCurrentDayAndTimeAndProfessor(String currentDay, Time currentTime,Long professorId);

    @Query("SELECT COUNT(DISTINCT s.sessionId) " +
            "FROM Session s " +
            "WHERE s.module.moduleId = :moduleId " +
            "AND DATE(s.sessionDay) < CURRENT_DATE()")
    Long countSessionsByModule(@Param("moduleId") Long moduleId);


    List<Session> findByLevel_LevelId(Long levelId);


    List<Session> findByModule(Module module);

    List<Session> findByProfessorProfessorId(Long professorId);
    @Query("SELECT s FROM Session s WHERE s.professor.professorId = :professorId AND s.sessionDay != 'none'")
    List<Session> findAllSessionForProfessor(long professorId);

}
