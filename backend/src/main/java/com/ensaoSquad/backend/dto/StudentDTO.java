package com.ensaoSquad.backend.dto;

import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.dto.LevelDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDTO {

    private long studentId;
    private long apogee;
    private String firstName;
    private String lastName;
    private String email;
    private String groupName;
    private LevelDTO level;
}
