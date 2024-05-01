package com.ensaoSquad.backend.mapper;

import com.ensaoSquad.backend.dto.AbsenceDTO;
import com.ensaoSquad.backend.model.Absence;

public class AbsenceMapper {
    public static AbsenceDTO toDTO(Absence absence){
        AbsenceDTO absenceDTO =new AbsenceDTO();
        absenceDTO.setAbsenceId(absence.getAbsenceId());
        absenceDTO.setDateAbsence(absence.getDateAbsence());
        absenceDTO.setJustified(absence.isJustified());
        absenceDTO.setSessionDTO(SessionMapper.toDTO(absence.getSession()));
        absenceDTO.setStudentDTO(StudentMapper.toDTO(absence.getStudent()));
        return absenceDTO;
    }

    public static Absence toEntity(AbsenceDTO absenceDTO){
        Absence absence = new Absence();
        absence.setAbsenceId(absenceDTO.getAbsenceId());
        absence.setDateAbsence(absenceDTO.getDateAbsence());
        absence.setJustified(absenceDTO.isJustified());
        absence.setSession(SessionMapper.toEntity(absenceDTO.getSessionDTO()));
        absence.setStudent(StudentMapper.toEntity(absenceDTO.getStudentDTO()));
        return absence;
    }
}
