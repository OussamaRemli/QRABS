package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.dto.LevelDTO;
import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Level;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LevelRepository extends JpaRepository<Level, Long> {


    Level findByLevelName(String levelName);


    Level findByLevelId(long levelId);

    List<Level> findBySectorName(String sectorName);



}
