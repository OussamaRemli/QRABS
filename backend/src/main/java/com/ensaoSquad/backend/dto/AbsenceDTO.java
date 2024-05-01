package com.ensaoSquad.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AbsenceDTO {
    private Long absenceId;
    private Date dateAbsence;
    private boolean Justified;
    private SessionDTO sessionDTO;
    private StudentDTO studentDTO;
}
