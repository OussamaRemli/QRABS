package com.ensaoSquad.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProfessorModulesDTO {
    private Long professorId;
    private String professorName;
    private List<String> modules;


}
