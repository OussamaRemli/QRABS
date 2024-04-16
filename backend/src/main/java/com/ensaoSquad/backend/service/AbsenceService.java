package com.ensaoSquad.backend.service;

import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.model.Student;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface AbsenceService {
    public void markPresnt(long seanceId , long studentId , long levelId);
    public void markAbsent(long idSeance , long levelId);

    public Map<Student, Long> getAbsenceCountsByProfessorModuleAndLevel(Professor professor, Module module, Level level);

}
