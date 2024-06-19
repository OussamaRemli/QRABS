package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.dto.StudentDTO;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

     List<Student> findByLevel(Level level);
     Student findByStudentId(long studentId);

    @Query("SELECT s FROM Student s WHERE s.level.levelName = :levelName AND s.groupName = :groupName")
    List<Student> findByLevelNameAndGroupName(@Param("levelName") String levelName, @Param("groupName") String groupName);
    Student findByApogee(long apogee);
    // Method to count the number of records in the table
    long count();
//    @Query("SELECT s FROM Student s JOIN s.level l WHERE l.levelName = :levelName")
//    List<Student> findByLevelName(@Param("levelName") String levelName);
    List<Student> findByLevelLevelName(String levelName);

    @Modifying
    @Query("DELETE FROM Student s WHERE s.level = :level")
    void deleteByLevel(@Param("level") Level level);

    boolean existsStudentByLevel(Level level);

    Long countStudentsByLevel(Level level);


    List<Student> findByLevel_LevelId(Long levelId);

    boolean existsByApogee(long apogee);
    boolean existsByEmail(String email);

}
