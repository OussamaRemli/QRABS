package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.model.*;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.repository.AbsenceRepository;
import com.ensaoSquad.backend.repository.LevelRepository;
import com.ensaoSquad.backend.repository.SessionRepository;
import com.ensaoSquad.backend.repository.StudentRepository;
import com.ensaoSquad.backend.service.AbsenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

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
    @Autowired
    private SimpMessagingTemplate template;

    private Map<Long, Set<Long>> presentStudents = new HashMap<>();
    private Map<Long, Set<String>> scannedIps = new HashMap<>(); // Nouveau


    private int count;

    @Override
    public void markPresnt(long seanceId, long studentId, long levelId , String ip ,Long Apogee) {
        Set<String> sessionIps = scannedIps.computeIfAbsent(seanceId, k -> new HashSet<>());
        if (!sessionIps.contains(ip)) {
            Set<Long> students = presentStudents.computeIfAbsent(levelId, k -> new HashSet<>());
            if (!students.contains(studentId)) {
                students.add(studentId);
                sessionIps.add(ip); // Ajoute l'IP à la liste des IPs scannées pour cette séance
                count = students.size(); // Met à jour le compteur avec la taille du nouveau set
                this.template.convertAndSend("/topic/presence", Apogee);
                System.out.println(count);
                this.template.convertAndSend("/topic/count", count);
            }
        } else {
            System.out.println("L'adresse IP a déjà été utilisée pour scanner lors de cette séance.");
        }}


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

    @Override
    public Map<Student, Map<String, Long>> getAbsenceCountsByProfessorModuleAndLevel(Professor professor, Module module, Level level) {
        List<Object[]> results = absenceRepository.getAbsenceCountByProfessorModuleAndLevel(professor, module, level);

        return results.stream()
                .collect(Collectors.groupingBy(
                        result -> (Student) result[0],
                        Collectors.toMap(
                                result -> (String) result[1],
                                result -> (Long) result[2]
                        )
                ));
    }


}
