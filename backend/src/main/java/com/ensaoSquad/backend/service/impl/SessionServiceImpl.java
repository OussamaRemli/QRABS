package com.ensaoSquad.backend.service.impl;

import java.io.IOException;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.ensaoSquad.backend.dto.LevelDTO;
import com.ensaoSquad.backend.dto.ModuleDTO;
import com.ensaoSquad.backend.dto.ProfessorDTO;
import com.ensaoSquad.backend.dto.SessionDTO;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.mapper.SessionMapper;
import com.ensaoSquad.backend.model.Session;
import com.ensaoSquad.backend.repository.SessionRepository;
import com.ensaoSquad.backend.service.LevelService;
import com.ensaoSquad.backend.service.ModuleService;
import com.ensaoSquad.backend.service.ProfessorService;
import com.ensaoSquad.backend.service.SessionService;
import lombok.Data;

@Service
@Data
public class SessionServiceImpl implements SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    private final LevelService levelService;
    private final ModuleService moduleService;
    private final ProfessorService professorService;
    private List<SessionDTO> uploadedSessionDTOs = new ArrayList<>();

    @Override
    public List<SessionDTO> uploadSessionFromExcel(MultipartFile file) {
        List<SessionDTO> uploadedSession = new ArrayList<>();
        try {
            Workbook workbook = WorkbookFactory.create(file.getInputStream());
            Sheet sheet = workbook.getSheetAt(0);
            String [] weekDays ={"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
            int startRow = 9;
            int startColumn = 7 ;
            for(String day :weekDays) {
                for (int i = 0, j = 0; i < 4; i++, j = j + 6) {
                    uploadedSession.addAll(parseSessionExcel(sheet, startRow, startColumn + j, day));
                }
                startRow+=8;

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
                String moduleName = sheet.getRow(startRow).getCell(startColumn+i*3).getStringCellValue();
                if(moduleName.isEmpty()) continue;
                String groupName = sheet.getRow(startRow + 1).getCell(startColumn+i*3).getStringCellValue();
                String sessionType = sheet.getRow(startRow + 2).getCell(startColumn+i*3).getStringCellValue();
                String professorLastName = sheet.getRow(startRow + 3).getCell(startColumn+i*3).getStringCellValue();
                String startTimeString = sheet.getRow(8).getCell(startColumn).getStringCellValue();
                String endTimeString = sheet.getRow(8).getCell(startColumn + 3).getStringCellValue();
                ModuleDTO moduleDTO = moduleService.findModuleByName(moduleName);
                ProfessorDTO professorDTO = professorService.findByName(professorLastName);
                Time startTime = Time.valueOf(startTimeString);
                Time endTime = Time.valueOf(endTimeString);

                SessionDTO sessionDTO = createSessionDTO(levelDTO, byGroup, groupName, sessionType, moduleDTO,
                        professorDTO, startTime, endTime, sessionDay);
                Session session = SessionMapper.toEntity(sessionDTO);
                sessionRepository.save(session);

                uploadedSessionDTOs.add(sessionDTO);
            }
        } else {
            String moduleName = sheet.getRow(startRow).getCell(startColumn).getStringCellValue();
            if(!moduleName.isEmpty()){
            String groupName = sheet.getRow(startRow + 1).getCell(startColumn).getStringCellValue();
            String sessionType = sheet.getRow(startRow + 2).getCell(startColumn).getStringCellValue();
            String professorLastName = sheet.getRow(startRow + 3).getCell(startColumn).getStringCellValue();
            String startTimeString = sheet.getRow(8).getCell(startColumn).getStringCellValue();
            String endTimeString = sheet.getRow(8).getCell(startColumn + 3).getStringCellValue();

            ModuleDTO moduleDTO = moduleService.findModuleByName(moduleName);
            if (moduleDTO == null) {
                throw new RessourceNotFoundException("Le module " + moduleDTO + " n'existe pas");
            }
            ProfessorDTO professorDTO = professorService.findByName(professorLastName);
            if (professorDTO == null) {
                throw new RessourceNotFoundException("Le professor " + professorLastName + " n'existe pas");
            }
            Time startTime = Time.valueOf(startTimeString);
            Time endTime = Time.valueOf(endTimeString);

            SessionDTO sessionDTO = createSessionDTO(levelDTO, byGroup, groupName, sessionType, moduleDTO,
                    professorDTO, startTime, endTime, sessionDay);
            Session session = SessionMapper.toEntity(sessionDTO);
            sessionRepository.save(session);

            uploadedSessionDTOs.add(sessionDTO);
        }
        }
        return uploadedSessionDTOs;
    }

    public LevelDTO getLevelFromSheet(Sheet sheet) {
        Row headerRow = sheet.getRow(0);
        String levelName = headerRow.getCell(2).getStringCellValue();
        LevelDTO levelDTO = levelService.getLevelByName(levelName);
        if (levelDTO == null) {
            throw new RessourceNotFoundException("Le niveau " + levelName + " n'existe pas");
        }
        return levelDTO;
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
}