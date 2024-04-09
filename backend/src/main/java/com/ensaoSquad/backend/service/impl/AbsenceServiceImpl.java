package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.model.Absence;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Session;
import com.ensaoSquad.backend.model.Student;
import com.ensaoSquad.backend.repository.AbsenceRepository;
import com.ensaoSquad.backend.repository.LevelRepository;
import com.ensaoSquad.backend.repository.SessionRepository;
import com.ensaoSquad.backend.repository.StudentRepository;
import com.ensaoSquad.backend.service.AbsenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
public class AbsenceServiceImpl implements AbsenceService {

    @Autowired
    private AbsenceRepository absenceRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private LevelRepository levelRepository;
    @Autowired
    private SessionRepository sessionRepository;

    private Map<Long, Set<Long>> presentStudents = new HashMap<>();

    @Override
    public void markPresnt(long seanceId, long studentId, long levelId) {
        Set<Long> students = presentStudents.computeIfAbsent(levelId, k -> new HashSet<>());
        if (!students.contains(studentId)) {
            students.add(studentId);
        }
    }


    @Override
    public void markAbsent(long sessionId, long levelId) {
        Level level = levelRepository.findByLevelId(levelId);
        Session session = sessionRepository.findBySessionId(sessionId);
        if (level == null || session == null) {
            return;
        }

        List<Student> studentsInLevel = studentRepository.findByLevel(level);

        Set<Long> presentStudentIds = presentStudents.getOrDefault(levelId, Collections.emptySet());

        for (Student student : studentsInLevel) {
            if (!presentStudentIds.contains(student.getStudentId())) {
                Absence absence = new Absence();
                absence.setSession(session);
                absence.setStudent(student);
                absence.setDateAbsence(Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()));
                absenceRepository.save(absence);
            }
        }
        presentStudents.remove(levelId);
    }

}
