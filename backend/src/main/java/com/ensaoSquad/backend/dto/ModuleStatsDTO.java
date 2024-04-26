package com.ensaoSquad.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor @NoArgsConstructor
public class ModuleStatsDTO {
    private int totalSessions;
    private int totalAbsences;
    private int totalEleves;
}
