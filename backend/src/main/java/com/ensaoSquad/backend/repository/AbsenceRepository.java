package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.dto.SessionDTO;
import com.ensaoSquad.backend.model.*;
import com.ensaoSquad.backend.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AbsenceRepository extends JpaRepository<Absence ,Long> {
    //    @Query("SELECT s, COUNT(a) " +
//            "FROM Student s " +
//            "JOIN s.level l " +
//            "JOIN Session ses ON ses.level = l " +
//            "JOIN Absence a ON a.student = s AND a.session = ses " +
//            "WHERE ses.professor = :professor " +
//            "AND ses.module = :module " +
//            "AND l = :level " +
//            "GROUP BY s")
//    List<Object[]> getAbsenceCountByProfessorModuleAndLevel(@Param("professor") Professor professor,
//                                                            @Param("module")Module module,
//
    @Query("SELECT s, ses.sessionType, COUNT(a) " +
            "FROM Student s " +
            "JOIN s.level l " +
            "JOIN Session ses ON ses.level = l " +
            "JOIN Absence a ON a.student = s AND a.session = ses " +
            "WHERE ses.professor = :professor " +
            "AND ses.module = :module " +
            "AND l = :level " +
            "AND a.Justified = false " +
            "GROUP BY s, ses.sessionType")
    List<Object[]> getAbsenceCountByProfessorModuleAndLevel(@Param("professor") Professor professor,
                                                            @Param("module") Module module,
                                                            @Param("level") Level level);

    @Query("SELECT s, ses.sessionType, COUNT(a) " +
            "FROM Student s " +
            "JOIN s.level l " +
            "JOIN Session ses ON ses.level = l " +
            "JOIN Absence a ON a.student = s AND a.session = ses " +
            "AND a.Justified = false " +
            "AND ses.module = :module " +
            "AND l = :level " +
            "GROUP BY s, ses.sessionType")
    List<Object[]> getAbsenceCountByModuleAndLevel(@Param("module") Module module,
                                                            @Param("level") Level level);

    @Query("SELECT ses.sessionType, a.dateAbsence, a.absenceId, a.Justified " +
            "FROM Absence a " +
            "JOIN a.session ses " +
            "WHERE a.student = :student " +
            "AND ses.module = :module")
    List<Object[]> getDetailsStudentAbsencesByStudentIdAndModule(@Param("student") Student student, @Param("module") Module module);
    @Query("SELECT ses.sessionType, a.dateAbsence, a.absenceId, a.Justified " +
            "FROM Absence a " +
            "JOIN a.session ses " +
            "WHERE a.student = :student " +
            "AND a.Justified = false " +
            "AND ses.module = :module")
    List<Object[]> getStudentAbsencesByStudentIdAndModule(@Param("student") Student student, @Param("module") Module module);

    int countBySession(Session session);
    @Query("SELECT COUNT(a) FROM Absence a JOIN a.session s WHERE s.module = :module")
    Long findByModule(@Param("module") Module module);

    @Query("SELECT a.session.module.moduleName, COUNT(a) FROM Absence a WHERE a.Justified = false AND a.session.level = :level GROUP BY a.session.module.moduleName")
    List<Object[]> countAbsenceByModuleInLevel(Level level);

    @Query("SELECT COUNT(a) FROM Absence a WHERE a.Justified = false AND a.session.level.levelId = :levelId AND a.session.module.moduleName = :moduleName")
    Long countAbsenceByLevelAndModuleName(@Param("levelId") long levelId, @Param("moduleName") String moduleName);

    @Query("SELECT MAX(absence_count) FROM (" +
            "SELECT COUNT(a) AS absence_count " +
            "FROM Absence a " +
            "JOIN a.session s " +
            "WHERE a.Justified = false " +
            "AND s.module.moduleId = :moduleId " +
            "AND s.level.levelId = :levelId " +
            "GROUP BY a.student.studentId)")
    Long findMaxAbsenceCountByModuleAndLevel(@Param("moduleId") Long moduleId, @Param("levelId") Long levelId);

    @Query("SELECT MAX(sub.absence_count) FROM (" +
            "SELECT COUNT(a) AS absence_count " +
            "FROM Absence a " +
            "JOIN a.session s " +
            "WHERE a.Justified = false " +
            "AND a.student.level.levelId = :levelId " +
            "GROUP BY s.module.moduleId, a.student.studentId) sub")
    Long findMaxAbsenceCountByLevel(@Param("levelId") Long levelId);



}




