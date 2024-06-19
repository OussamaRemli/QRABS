package com.ensaoSquad.backend.service.impl;

import java.io.IOException;
import java.sql.Time;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import com.ensaoSquad.backend.dto.*;
import com.ensaoSquad.backend.exception.MultipleFoundException;
import com.ensaoSquad.backend.mapper.LevelMapper;
import com.ensaoSquad.backend.mapper.ModuleMapper;
import com.ensaoSquad.backend.mapper.ProfessorMapper;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.repository.AbsenceRepository;
import com.ensaoSquad.backend.repository.LevelRepository;
import com.ensaoSquad.backend.service.*;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.mapper.SessionMapper;
import com.ensaoSquad.backend.model.Session;
import com.ensaoSquad.backend.repository.SessionRepository;
import lombok.Data;

@Service
@Data
public class SessionServiceImpl implements SessionService {

    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private LevelRepository levelRepository;
    @Autowired
    private AbsenceRepository absenceRepository;

    private final LevelService levelService;
    private ModuleService moduleService;
    @Autowired
    private void setModuleService(@Lazy ModuleService moduleService){
        this.moduleService=moduleService;
    }
    private final ProfessorService professorService;
    private List<SessionDTO> uploadedSessionDTOs = new ArrayList<>();

    @Transactional
    @Override
    public List<SessionDTO> uploadSessionFromExcel(MultipartFile file) {

        List<SessionDTO> uploadedSession = new ArrayList<>();
        try {
            Workbook workbook = WorkbookFactory.create(file.getInputStream());
            Sheet sheet = workbook.getSheetAt(0);
            LevelDTO levelDTO = getLevelFromSheet(sheet);
            Level level = LevelMapper.toEntity(levelDTO);

            // Fetch the existing sessions by level name
            List<Session> existingSessions = sessionRepository.findSessionsByLevelName(levelDTO.getLevelName());

            // Update the session day by adding 1
            for (Session session : existingSessions) {
                session.setSessionDay("none");
            }
            sessionRepository.saveAll(existingSessions);
             String[] weekDays = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
            int startRow = 9;
            int startColumn = 7;
            for (String day : weekDays) {
                for (int i = 0, j = 0; i < 4; i++, j = j + 6) {
                    uploadedSession.addAll(parseSessionExcel(sheet, startRow, startColumn + j, day));
                }
                startRow += 8;

            }
            return uploadedSession;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<SessionDTO> parseSessionExcel(Sheet sheet, int startRow, int startColumn, String sessionDay) {
        LevelDTO levelDTO = getLevelFromSheet(sheet);
        boolean byGroup = isByGroup(sheet, startRow, startColumn);
        List<SessionDTO> uploadedSessionDTOs = new ArrayList<>();


        if (byGroup) {
            for (int i = 0; i < 2; i++) {
                String moduleName = sheet.getRow(startRow).getCell(startColumn + i * 3).getStringCellValue();
                if (moduleName.isEmpty()) continue;
                String groupName = sheet.getRow(startRow + 1).getCell(startColumn + i * 3).getStringCellValue();
                String sessionType = sheet.getRow(startRow + 2).getCell(startColumn + i * 3).getStringCellValue();
                String[] professorData = sheet.getRow(startRow + 3).getCell(startColumn + i * 3)
                        .getStringCellValue().split("-");
                String startTimeString = sheet.getRow(8).getCell(startColumn).getStringCellValue();
                String endTimeString = sheet.getRow(8).getCell(startColumn + 3).getStringCellValue();
                ModuleDTO moduleDTO = moduleService.findByModuleNameAndLevelName(moduleName,LevelMapper.toEntity(levelDTO));
                Professor prof;
                if (professorData.length == 3) {
                    long profId = Long.parseLong(professorData[2]);
                    prof = ProfessorMapper.toEntity(professorService.findById(profId));
                }else{
                    List<Professor> professors = professorService.findByFirstNameAndLastName(professorData[1], professorData[0]);
                    if (professors.size() > 1) {
                        throw new MultipleFoundException("Plus d'un professeur trouvé avec le prénom : " +
                                professorData[1] + " et le nom de famille : " + professorData[0]);

                    }
                    prof = professors.isEmpty() ? null : professors.get(0);
                }
                if (prof == null) throw  new RessourceNotFoundException("le professeur: "+professorData[0]+" "+professorData[1]+" n'existe pas");
                ProfessorDTO professorDTO = ProfessorMapper.toDTO(prof);
                Time startTime = Time.valueOf(startTimeString);
                Time endTime = Time.valueOf(endTimeString);

                SessionDTO sessionDTO = createSessionDTO(levelDTO, byGroup, groupName, sessionType, moduleDTO,
                        professorDTO, startTime, endTime, sessionDay);
                Session session = SessionMapper.toEntity(sessionDTO);
                sessionRepository.save(session);

            }
        } else {
            String moduleName = sheet.getRow(startRow).getCell(startColumn).getStringCellValue();
            if (!moduleName.isEmpty()) {
                String groupName = sheet.getRow(startRow + 1).getCell(startColumn).getStringCellValue();
                String sessionType = sheet.getRow(startRow + 2).getCell(startColumn).getStringCellValue();
                String[] professorData = sheet.getRow(startRow + 3).getCell(startColumn).getStringCellValue().split("-");
                String startTimeString = sheet.getRow(8).getCell(startColumn).getStringCellValue();
                String endTimeString = sheet.getRow(8).getCell(startColumn + 3).getStringCellValue();

                ModuleDTO moduleDTO = moduleService.findByModuleNameAndLevelName(moduleName,LevelMapper.toEntity(levelDTO));
                if (moduleDTO == null) {
                    throw new RessourceNotFoundException("Le module " + moduleDTO + " n'existe pas");
                }
                Professor prof;
                if (professorData.length == 3) {
                    long profId = Long.parseLong(professorData[2]);
                    prof = ProfessorMapper.toEntity(professorService.findById(profId));
                }else{
                    List<Professor> professors = professorService.findByFirstNameAndLastName(professorData[1], professorData[0]);
                    if (professors.size() > 1) {
                        throw new MultipleFoundException("More than one professor found with first name: " +
                                professorData[1] + " and last name: " + professorData[0]);
                    }
                    prof = professors.isEmpty() ? null : professors.get(0);
                }
                if (prof == null) throw  new RessourceNotFoundException("le professeur: "+professorData[0]+" "+professorData[1]+" n'existe pas");
                ProfessorDTO professorDTO = ProfessorMapper.toDTO(prof);
                Time startTime = Time.valueOf(startTimeString);
                Time endTime = Time.valueOf(endTimeString);

                SessionDTO sessionDTO = createSessionDTO(levelDTO, byGroup, groupName, sessionType, moduleDTO,
                        professorDTO, startTime, endTime, sessionDay);
                Session session = SessionMapper.toEntity(sessionDTO);
                sessionRepository.save(session);

            }
        }
        return uploadedSessionDTOs;
    }

    public LevelDTO getLevelFromSheet(Sheet sheet) {
        Row headerRow = sheet.getRow(1);
        String levelName = headerRow.getCell(15).getStringCellValue();
        LevelDTO levelDTO = levelService.getLevelByName(levelName);
        if (levelDTO == null) {
            throw new RessourceNotFoundException("Le niveau " + levelName + " n'existe pas");
        }
        return levelDTO;
    }

    @Override
    public void deleteAllSessionByLevelName(String levelName) {
        Level level = levelRepository.findByLevelName(levelName);
        if (level != null) {
            sessionRepository.deleteByLevel(level);
        } else {
            throw new RessourceNotFoundException("Le niveau " + levelName + " n'existe pas");
        }

    }

    // retouner le  id du module á partir la séance actuelle  du professeur
    @Override
    public Long findModuleIdsByProfessorIdAndCurrentTimeAndDay(long professorId, String currentDay, Time currentTime) {
        return sessionRepository.findModuleIdsByProfessorIdAndCurrentTimeAndDay(professorId, currentDay, currentTime);
    }

    @Override
    public List<Long> findLevelIdsByProfessorIdAndCurrentTimeAndDay(long professorId, String currentDay, Time currentTime) {
        return sessionRepository.findLevelIdsByProfessorIdAndCurrentTimeAndDay(professorId,currentDay,currentTime);
    }

    @Override
    public List<Session> getCurrentSession(Long professorId) {
        long currentTimeMillis = System.currentTimeMillis();
        Time time = new Time(currentTimeMillis);
        LocalDate currentDay =LocalDate.now();
        String day = currentDay.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        // Call the repository method to find the session for the current day and time
        return sessionRepository.findSessionForCurrentDayAndTimeAndProfessor(day, time,professorId);
    }

    @Override
    public List<Session> getNextSession(long professorId) {
        LocalTime currentTime = LocalTime.now();
        LocalDate currentDate = LocalDate.now();
        String currentDay = currentDate.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        String[] daysOfWeek = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};
        int currentIndex = Arrays.asList(daysOfWeek).indexOf(currentDay);

        // Adjusting days of the week to consider wrap-around at week end
        List<String> daysOrder = new ArrayList<>(Arrays.asList(daysOfWeek));
        Collections.rotate(daysOrder, -currentIndex);

        // Find all sessions for the current day
        List<Session> sessionsToday = sessionRepository.findSessionsForToday(professorId, currentDay);
        // Filter out the sessions that have already ended
        List<Session> futureSessionsToday = sessionsToday.stream()
                .filter(session -> session.getEndTime().toLocalTime().isAfter(currentTime))
                .collect(Collectors.toList());

        if (!futureSessionsToday.isEmpty()) {
            // Return future sessions for the current day
            return futureSessionsToday;
        } else {
            // If no future sessions today, find the next session in the upcoming days
            List<Session> nextSessions = sessionRepository.findNextSessionForProfessor(professorId, daysOrder, currentDay, currentTime);
            if (nextSessions.isEmpty() && sessionsToday.size() == 1) {
                // If only one session today and no future sessions, return it
                return sessionsToday;
            }
            return nextSessions;
        }
    }















    @Override
    public List<Session> findAllSessionForProfessor(long professorId) {
        return sessionRepository.findAllSessionForProfessor(professorId);
    }

    @Override
    public void deleteAllsession() {
        absenceRepository.deleteAll();
        sessionRepository.deleteAll();
    }

    @Override
    public List<Module> getProfessorsAndModules(Long id) {
        //List<Session> sessions = sessionRepository.findAll();
        List<Session> sessions = sessionRepository.findByProfessorProfessorId(id);
        // Extract modules from sessions and remove duplicates
        return sessions.stream()
                .map(Session::getModule)
                .distinct()
                .collect(Collectors.toList());
    }


    @Override
    public boolean isByGroup(Sheet sheet, int startRow, int startColumn) {
        Row sessionRow = sheet.getRow(startRow + 1);
        return !sessionRow.getCell(startColumn).getStringCellValue().isEmpty() ||
                !sessionRow.getCell(startColumn + 3).getStringCellValue().isEmpty();
    }

    public SessionDTO createSessionDTO(LevelDTO levelDTO, boolean byGroup, String groupName, String sessionType,
                                       ModuleDTO moduleDTO, ProfessorDTO professorDTO, Time startTime, Time endTime,
                                       String sessionDay) {
        SessionDTO sessionDTO = new SessionDTO();
        sessionDTO.setSessionDay(sessionDay);
        sessionDTO.setStartTime(startTime);
        sessionDTO.setEndTime(endTime);
        sessionDTO.setByGroup(byGroup);
        sessionDTO.setGroupName(groupName);
        sessionDTO.setLevelDTO(levelDTO);
        sessionDTO.setModuleDTO(moduleDTO);
        sessionDTO.setProfessorDTO(professorDTO);
        sessionDTO.setSessionType(sessionType);
        return sessionDTO;
    }

    public boolean anySessionsExist() {
        return sessionRepository.count() > 0;
    }
}
