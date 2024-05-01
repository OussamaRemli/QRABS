package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.dto.StudentAbsenceDTO;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
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
                sessionIps.add(ip);
                count = students.size();
                this.template.convertAndSend("/topic/presence", Apogee);
                System.out.println(count);
                this.template.convertAndSend("/topic/count", count);
            }
        } else {
            System.out.println("L'adresse IP a déjà été utilisée pour scanner lors de cette séance.");
        }}


    @Override
    public void markAbsent(long sessionId, long levelId,String group) {
        Level level = levelRepository.findByLevelId(levelId);
        Session session = sessionRepository.findBySessionId(sessionId);
        if (level == null || session == null) {
            return;
        }
        List<Student> studentsInLevel;
        if(group.equals("none")) {
             studentsInLevel = studentRepository.findByLevel(level);
        }else{
             studentsInLevel = studentRepository.findByLevelNameAndGroupName(level.getLevelName(),group);

        }
        Set<Long> presentStudentIds = presentStudents.getOrDefault(levelId, Collections.emptySet());

        //boolean releazed=false;
        for (Student student : studentsInLevel) {
            if (!presentStudentIds.contains(student.getStudentId())) {
                //releazed=true;
                Absence absence = new Absence();
                absence.setSession(session);
                absence.setStudent(student);
                absence.setDateAbsence(Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()));
                absenceRepository.save(absence);
            }
        }

        presentStudents.remove(levelId);
        scannedIps.remove(sessionId);
    }

    @Override
    public void isNotPresent(long studentId, long levelId, Long apogee) {
        Set<Long> students = presentStudents.computeIfAbsent(levelId, k -> new HashSet<>());
        if (students.contains(studentId)) {
        students.remove(studentId);
        this.template.convertAndSend("/topic/count", students.size());
        this.template.convertAndSend("/topic/absence", apogee);

        }
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
    //getting one student and their absence dates and the session type each date
    @Override
    public Map<Student, List<StudentAbsenceDTO>> getStudentAbsenceDetail(long appoge,Module module){
        Student student = studentRepository.findByApogee(appoge);
        List<Object[]> results = absenceRepository.getStudentAbsencesByStudentIdAndModule(student, module);
        List<StudentAbsenceDTO> studentAbsences = new ArrayList<>();

        for (Object[] result : results) {
            String sessionType = (String) result[0];
            Date absenceDate = (Date) result[1];
            long absenceId = (long) result[2];
            boolean justified = (boolean) result[3];

            studentAbsences.add(new StudentAbsenceDTO(absenceId,absenceDate, sessionType,justified));
        }

        Map<Student, List<StudentAbsenceDTO>> studentAbsencesMap = new HashMap<>();
        studentAbsencesMap.put(student,studentAbsences);

        return studentAbsencesMap;
    }

    @Override
    public List<Object[]> countAbsenceByModuleInLevel(Level level){

        return absenceRepository.countAbsenceByModuleInLevel(level);
    }

    @Override
    public long countAbsenceInLevel(Level level){
        List<Object[]> results = absenceRepository.countAbsenceByModuleInLevel(level);
        Long total = 0L;
        for (Object[] count : results){
            total += (Long) count[1];
        }
        return total;
    }

    @Override
    public Absence findAbsenceById(long absenceId) {
        Optional<Absence> absenceOpt = absenceRepository.findById(absenceId);

        return absenceOpt.orElseThrow(() -> new RessourceNotFoundException("Absence not found with ID: " + absenceId));
    }

    @Override
    public Absence toggleJustified(long absenceId) {
        Absence absence = findAbsenceById(absenceId);
        absence.setJustified(!absence.isJustified());
        return absenceRepository.save(absence);
    }


}
