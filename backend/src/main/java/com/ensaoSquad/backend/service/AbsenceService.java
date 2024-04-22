package com.ensaoSquad.backend.service;

import com.ensaoSquad.backend.dto.StudentAbsenceDTO;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.model.Student;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface AbsenceService {
    public void markPresnt(long seanceId , long studentId , long levelId , String ip , Long apogee);
    public void markAbsent(long idSeance , long levelId);

    public void isNotPresent(long studentId , long levelId , Long apogee);

    public Map<Student, Map<String, Long>> getAbsenceCountsByProfessorModuleAndLevel(Professor professor, Module module, Level level);

    public Map<Student, List<StudentAbsenceDTO>> getStudentAbsenceDetail(long appoge, Module module);
}
