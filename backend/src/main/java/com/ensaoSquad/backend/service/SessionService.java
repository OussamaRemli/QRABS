package com.ensaoSquad.backend.service;

import com.ensaoSquad.backend.dto.*;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.model.Session;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Time;
import java.util.List;
import java.util.Optional;

public interface SessionService {

    List<SessionDTO>  uploadSessionFromExcel(MultipartFile file);

    List<SessionDTO> parseSessionExcel(Sheet sheet, int startRow, int startColumn , String sessionDay);

    boolean isByGroup(Sheet sheet, int startRow, int startColumn);
    SessionDTO createSessionDTO(LevelDTO levelDTO, boolean byGroup, String groupName, String sessionType,
                                        ModuleDTO moduleDTO, ProfessorDTO professorDTO, Time startTime, Time endTime,
                                        String sessionDay);
     LevelDTO getLevelFromSheet(Sheet sheet);

     void deleteAllSessionByLevelName(String levelName);

     Long findModuleIdsByProfessorIdAndCurrentTimeAndDay(long professorId, String currentDay, Time currentTime);

     List<Long> findLevelIdsByProfessorIdAndCurrentTimeAndDay(long professorId, String currentDay, Time currentTime);

     public List<Session> getCurrentSession(Long Professor);

    List<Session> getNextSession(long professorId);

    List<Module> getProfessorsAndModules(Long id);
    List<Session> findAllSessionForProfessor(long professorId);
    void deleteAllsession();
    public boolean anySessionsExist();

}
