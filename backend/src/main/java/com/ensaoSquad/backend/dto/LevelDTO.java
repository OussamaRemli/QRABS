package com.ensaoSquad.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LevelDTO {
    private long levelId;
    private String levelName;
    private String sectorName;
}
