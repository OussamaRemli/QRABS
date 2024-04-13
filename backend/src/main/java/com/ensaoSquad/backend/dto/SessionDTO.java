package com.ensaoSquad.backend.dto;

import lombok.Data;

import java.sql.Time;

@Data
public class SessionDTO {
    private String sessionDay;
    private String sessionType;
    private Time startTime;
    private Time endTime;
    private Boolean byGroup;
    private String groupName;
    private LevelDTO levelDTO;
    private ModuleDTO moduleDTO;
    private ProfessorDTO professorDTO;
}

