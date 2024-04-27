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
            "GROUP BY s, ses.sessionType")
    List<Object[]> getAbsenceCountByProfessorModuleAndLevel(@Param("professor") Professor professor,
                                                            @Param("module") Module module,
                                                            @Param("level") Level level);

    @Query("SELECT ses.sessionType, a.dateAbsence " +
            "FROM Absence a " +
            "JOIN a.session ses " +
            "WHERE a.student = :student " +
            "AND ses.module = :module")
    List<Object[]> getStudentAbsencesByStudentIdAndModule(@Param("student") Student student, @Param("module") Module module);

    int countBySession(Session session);
    @Query("SELECT COUNT(a) FROM Absence a JOIN a.session s WHERE s.module = :module")
    Long findByModule(@Param("module") Module module);



}




