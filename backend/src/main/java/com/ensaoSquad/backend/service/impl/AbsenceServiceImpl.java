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

    private Map<Long, List<Long>> presentStudents = new HashMap<>();

    @Override
    public void markPresnt(long seanceId, long studentId, long levelId) {
        presentStudents.computeIfAbsent(levelId, k -> new ArrayList<>()).add(studentId);

    }

    @Override
    public void markAbsent(long sessionId, long levelId) {
        Level level = levelRepository.findByLevelId(levelId);
        Session session = sessionRepository.findBySessionId(sessionId);
        if (level == null || session == null) {
            // Handle invalid session or level ID
            return;
        }

        List<Student> studentsInLevel = studentRepository.findByLevel(level);

        // Get the list of present student IDs for this level
        List<Long> presentStudentIds = presentStudents.getOrDefault(levelId, Collections.emptyList());

        // Iterate through students in the level
        for (Student student : studentsInLevel) {
            // Check if the student is absent
            if (!presentStudentIds.contains(student.getStudentId())) {
                // Create Absence object
                Absence absence = new Absence();
                absence.setSession(session);
                absence.setStudent(student);
                absence.setDateAbsence(Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()));
                // Save the absence in the database
                absenceRepository.save(absence);
            }
        }

    }
}
