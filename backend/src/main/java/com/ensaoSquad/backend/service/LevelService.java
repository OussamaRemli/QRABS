package com.ensaoSquad.backend.service;

import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.dto.LevelDTO;
import java.util.List;

public interface LevelService {
    LevelDTO createLevel(LevelDTO levelDTO);
    LevelDTO getLevelByName(String levelName);
    LevelDTO getLevelById(Long levelId);

    List<LevelDTO> getAllLevels();
    List<LevelDTO> saveSectorData(String sectorAbbreviation);

    List<LevelDTO> getCurrentLevel(Long id);

    Level findById(Long levelId);
    public boolean levelHasStudents(String levelName);
    public boolean levelHasSchedule(String levelName) ;
    public Long getLevelIdByName(String levelName);

    }
