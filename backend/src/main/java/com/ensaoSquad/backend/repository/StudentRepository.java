package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    // Method to count the number of records in the table
    long count();
    @Query("SELECT s FROM Student s JOIN s.level l WHERE l.levelName = :levelName")
    List<Student> findByLevelName(@Param("levelName") String levelName);

    @Modifying
    @Query("DELETE FROM Student s WHERE s.level = :level")
    void deleteByLevel(@Param("level") Level level);
}
