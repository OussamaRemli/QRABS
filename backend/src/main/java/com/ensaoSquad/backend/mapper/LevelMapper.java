package com.ensaoSquad.backend.mapper;

import com.ensaoSquad.backend.dto.LevelDTO;
import com.ensaoSquad.backend.model.Level;

public class LevelMapper {

    public static LevelDTO toDTO(Level level) {
        LevelDTO dto = new LevelDTO();
        dto.setLevelId(level.getLevelId());
        dto.setLevelName(level.getLevelName());
        dto.setSectorName(level.getSectorName());
        return dto;
    }

    public static Level toEntity(LevelDTO dto) {
        Level level = new Level();
        level.setLevelId(dto.getLevelId());
        level.setLevelName(dto.getLevelName());
        level.setSectorName(dto.getSectorName());
        return level;
    }
}
