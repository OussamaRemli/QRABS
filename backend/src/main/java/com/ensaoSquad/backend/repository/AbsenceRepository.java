package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.model.Absence;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AbsenceRepository extends JpaRepository<Absence ,Long>{
    @Query("SELECT s, COUNT(a) " +
            "FROM Student s " +
            "JOIN s.level l " +
            "JOIN Session ses ON ses.level = l " +
            "JOIN Absence a ON a.student = s AND a.session = ses " +
            "WHERE ses.professor = :professor " +
            "AND ses.module = :module " +
            "AND l = :level " +
            "GROUP BY s")
    List<Object[]> getAbsenceCountByProfessorModuleAndLevel(@Param("professor") Professor professor,
                                                            @Param("module")Module module,
                                                            @Param("level") Level level);

}
