package com.ensaoSquad.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentAbsenceDTO {
    private Long absenceId;
    private Date absenceDate;
    private String sessionType;
    private boolean Justified;

}
