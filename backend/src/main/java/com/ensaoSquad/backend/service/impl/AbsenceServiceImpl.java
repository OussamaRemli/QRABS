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


    private final Map<Long, Set<Long>> presentStudents = new HashMap<>();
    private final Map<Long, Integer> levelCounts = new HashMap<>();
    private final Map<Map.Entry<Long, String>, Integer> groupCounts = new HashMap<>();

    public synchronized void markPresnt(long seanceId, long studentId, long levelId, Long Apogee, String group) {
        Set<Long> students = presentStudents.computeIfAbsent(levelId, k -> new HashSet<>());

        if (!students.contains(studentId)) {
            students.add(studentId);
            this.template.convertAndSend("/topic/presence", Apogee);

            if (group.equals("none")) {
                levelCounts.put(levelId, students.size());
                this.template.convertAndSend("/topic/count/" + levelId, levelCounts.get(levelId));
                System.out.println("Level " + levelId + " count: " + levelCounts.get(levelId));
            } else {
                Map.Entry<Long, String> groupKey = new AbstractMap.SimpleEntry<>(levelId, group);
                int newGroupCount = groupCounts.getOrDefault(groupKey, 0) + 1;
                groupCounts.put(groupKey, newGroupCount);
                this.template.convertAndSend("/topic/count/" + levelId + "/" + group, newGroupCount);
                System.out.println("Level " + levelId + " group " + group + " count: " + newGroupCount);
            }
        } else {
            System.out.println("Student " + studentId + " is already marked present for level " + levelId);
        }
    }


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
        Map.Entry<Long, String> groupKey = new AbstractMap.SimpleEntry<>(levelId, group);
        groupCounts.put(groupKey,0);
    }

    @Override
    public void isNotPresent(long studentId, long levelId, Long apogee, String group) {
        Set<Long> students = presentStudents.computeIfAbsent(levelId, k -> new HashSet<>());
        if (students.contains(studentId)) {
            students.remove(studentId);

            int levelCount = levelCounts.computeIfAbsent(levelId, k -> 0);
            if (levelCount > 0) {
                levelCounts.put(levelId, students.size());
            }

            this.template.convertAndSend("/topic/count/" + levelId, levelCounts.get(levelId));
            this.template.convertAndSend("/topic/absence", apogee); // Corrected the topic name

            Map.Entry<Long, String> groupKey = new AbstractMap.SimpleEntry<>(levelId, group);
            int newGroupCount = groupCounts.getOrDefault(groupKey, 0);
            if(newGroupCount>0){
            groupCounts.put(groupKey, newGroupCount-1);
            }
            this.template.convertAndSend("/topic/count/" + levelId + "/" + group, newGroupCount-1);
        }
    }




    


    //retrouve en utilisant prof
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

    @Override
    public Map<Student, Map<String, Long>> getAbsenceCountsByModuleAndLevel(Module module, Level level) {
        List<Object[]> results = absenceRepository.getAbsenceCountByModuleAndLevel(module, level);

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
        List<Object[]> results = absenceRepository.getDetailsStudentAbsencesByStudentIdAndModule(student, module);
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
    public Long  countAbsenceByLevelAndModuleName(long levelId, String moduleName) {
        return absenceRepository.countAbsenceByLevelAndModuleName(levelId, moduleName);
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

    public boolean anyAbsencesExist() {
        return absenceRepository.count() > 0;
    }

    @Override
    public boolean getMaxAbsence(Long moduleId, Long levelId) {
        Long l=absenceRepository.findMaxAbsenceCountByModuleAndLevel(moduleId,levelId);
        if(l==null)l=0L;
        return l>=3;
    }

    @Override
    public boolean getMaxAbsenceByLevel(Long levelId) {
        Long l=absenceRepository.findMaxAbsenceCountByLevel(levelId);
        System.out.println(l);
        if(l==null)l=0L;
        return l>=3;
    }


}
