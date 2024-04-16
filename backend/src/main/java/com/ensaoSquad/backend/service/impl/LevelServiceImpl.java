package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.dto.LevelDTO;
import com.ensaoSquad.backend.mapper.LevelMapper;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Session;
import com.ensaoSquad.backend.repository.LevelRepository;
import com.ensaoSquad.backend.service.LevelService;
import com.ensaoSquad.backend.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class LevelServiceImpl implements LevelService {

    @Autowired
    private LevelRepository levelRepository;

    private SessionService sessionService;

    @Autowired
    private  void  setSessionService(@Lazy SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Override
    public LevelDTO createLevel(LevelDTO levelDTO) {
        Level level = LevelMapper.toEntity(levelDTO);
        Level savedLevel = levelRepository.save(level);
        return LevelMapper.toDTO(savedLevel);
    }

    @Override
    public LevelDTO getLevelByName(String levelName) {
        Level level = levelRepository.findByLevelName(levelName);
        return LevelMapper.toDTO(level);
    }

    @Override
    public LevelDTO getLevelById(Long levelId) {
        Level level = levelRepository.findByLevelId(levelId);
        return LevelMapper.toDTO(level);
    }

    @Override
    public List<LevelDTO> getAllLevels() {
        List<Level> levels = levelRepository.findAll();
        return levels.stream()
                .map(LevelMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<LevelDTO> saveSectorData(String sectorAbbreviation) {
        // Extracting sector abbreviation from the request body
        String abbreviation = sectorAbbreviation.split("=")[1];
        List<LevelDTO> levelDTOS = new ArrayList<>();
        for (int i = 3; i <= 5; i++) {
            Level entity = new Level();
            entity.setLevelName(abbreviation + i);
            entity.setSectorName(abbreviation);
            LevelDTO levelDTO = LevelMapper.toDTO(levelRepository.save(entity));
            levelDTOS.add(levelDTO);
        }
        return levelDTOS;
    }

    @Override
    public List<LevelDTO> getCurrentLevel(Long id) {
        List<LevelDTO> levelDTOS = new ArrayList<>();
        long currentTimeMillis = System.currentTimeMillis();
        Time time = new Time(currentTimeMillis);
        LocalDate currentDay =LocalDate.now();
        String day = currentDay.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        List<Long> Ids = sessionService.findLevelIdsByProfessorIdAndCurrentTimeAndDay(id,day,time);
        for(Long i : Ids){
            levelDTOS.add(getLevelById(i));
        }
        return levelDTOS;
    }

    @Override
    public Level findById(Long levelId) {
        return levelRepository.findByLevelId(levelId);
    }


}
