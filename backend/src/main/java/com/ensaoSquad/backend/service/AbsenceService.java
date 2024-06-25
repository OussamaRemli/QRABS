package com.ensaoSquad.backend.service;

import com.beust.jcommander.IStringConverter;
import com.ensaoSquad.backend.dto.StudentAbsenceDTO;
import com.ensaoSquad.backend.model.*;
import com.ensaoSquad.backend.model.Module;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface AbsenceService {
    public void markPresnt(long seanceId , long studentId , long levelId , Long apogee , String group);
    public void markAbsent(long idSeance , long levelId ,String group);

    public void isNotPresent(long studentId , long levelId , Long apogee,String group);

    public Map<Student, Map<String, Long>> getAbsenceCountsByProfessorModuleAndLevel(Professor professor, Module module, Level level);

    public Map<Student, List<StudentAbsenceDTO>> getStudentAbsenceDetail(long appoge, Module module);

    public List<Object[]> countAbsenceByModuleInLevel(Level level);

    public Long countAbsenceByLevelAndModuleName(long levelId, String moduleName);

    public long countAbsenceInLevel(Level level);

    public Absence findAbsenceById(long absenceId);

    public Absence toggleJustified(long absenceId);

    public Map<Student, Map<String, Long>> getAbsenceCountsByModuleAndLevel(Module module, Level level);

    public boolean anyAbsencesExist();

    public boolean getMaxAbsence(Long moduleId, Long levelId);
    public boolean getMaxAbsenceByLevel(Long levelId);

;
}
