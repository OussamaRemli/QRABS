package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.dto.LevelDTO;
import com.ensaoSquad.backend.mapper.LevelMapper;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.repository.LevelRepository;
import com.ensaoSquad.backend.service.LevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LevelServiceImpl implements LevelService {

    @Autowired
    private LevelRepository levelRepository;

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


}
