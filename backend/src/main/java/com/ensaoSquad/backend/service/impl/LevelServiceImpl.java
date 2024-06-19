package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.dto.LevelDTO;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.mapper.LevelMapper;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Session;
import com.ensaoSquad.backend.model.Student;
import com.ensaoSquad.backend.repository.LevelRepository;
import com.ensaoSquad.backend.repository.SessionRepository;
import com.ensaoSquad.backend.repository.StudentRepository;
import com.ensaoSquad.backend.service.LevelService;
import com.ensaoSquad.backend.service.SessionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LevelServiceImpl implements LevelService {

    @Autowired
    private LevelRepository levelRepository;

    private SessionService sessionService;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private StudentRepository studentRepository;



    @Autowired
    private  void  setSessionService(@Lazy SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Override
    public LevelDTO createLevel(LevelDTO levelDTO) {
        Level level = LevelMapper.toEntity(levelDTO);
        Level savedLevel = levelRepository.save(level);
        return LevelMapper.toDTO(savedLevel);
    }

    @Override
    public LevelDTO getLevelByName(String levelName) {
        Level level = levelRepository.findByLevelName(levelName);
        if(level==null) {
            throw new RessourceNotFoundException("Le niveau " + levelName + " n'existe pas");
        }
        return LevelMapper.toDTO(level);
    }

    @Override
    public LevelDTO getLevelById(Long levelId) {
        Level level = levelRepository.findByLevelId(levelId);
        return LevelMapper.toDTO(level);
    }

    @Override
    public List<LevelDTO> getAllLevels() {
        List<Level> levels = levelRepository.findAll();
        return levels.stream()
                .map(LevelMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<LevelDTO> saveSectorData(String sectorAbbreviation) {
        List<LevelDTO> levelDTOS = new ArrayList<>();

        int start = sectorAbbreviation.equals("STPI") ? 1 : 3;
        int end = sectorAbbreviation.equals("STPI") ? 2 : 5;

        for (int i = start; i <= end; i++) {
            Level entity = new Level();
            entity.setLevelName(sectorAbbreviation + i);
            entity.setSectorName(sectorAbbreviation);
            LevelDTO levelDTO = LevelMapper.toDTO(levelRepository.save(entity));
            levelDTOS.add(levelDTO);
        }

        return levelDTOS;
    }

    @Override
    public List<LevelDTO> getCurrentLevel(Long id) {
        List<LevelDTO> levelDTOS = new ArrayList<>();
        long currentTimeMillis = System.currentTimeMillis();
        Time time = new Time(currentTimeMillis);
        LocalDate currentDay =LocalDate.now();
        String day = currentDay.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        List<Long> Ids = sessionService.findLevelIdsByProfessorIdAndCurrentTimeAndDay(id,day,time);
        for(Long i : Ids){
            levelDTOS.add(getLevelById(i));
        }
        return levelDTOS;
    }

    @Override
    public Level findById(Long levelId) {
        return levelRepository.findByLevelId(levelId);
    }


    // Obtenez le levelId à partir du levelName
    public Long getLevelIdByName(String levelName) {
        Level level = levelRepository.findByLevelName(levelName);
        if (level != null) {
            return level.getLevelId();
        } else {
            throw new EntityNotFoundException("Niveau non trouvé avec le nom : " + levelName);
        }
    }

    // Vérifie si le niveau a une emploi du temps
    public boolean levelHasSchedule(String levelName) {
        Level level = levelRepository.findByLevelName(levelName);
        if (level != null) {
            List<Session> sessions = sessionRepository.findByLevel_LevelId(level.getLevelId());
            return !sessions.isEmpty();
        }
        return false;
    }

    public boolean levelHasStudents(String levelName) {
        Level level = levelRepository.findByLevelName(levelName);
        if (level != null) {
            List<Student> students = studentRepository.findByLevel_LevelId(level.getLevelId());
            return !students.isEmpty();
        }
        return false;
    }

}
