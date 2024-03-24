package com.ensaoSquad.backend.mapper;

import com.ensaoSquad.backend.dto.SessionDTO;
import com.ensaoSquad.backend.model.Session;

public class SessionMapper {

    public static SessionDTO toDTO(Session session){
        SessionDTO sessionDTO = new SessionDTO();
        sessionDTO.setSessionDay(session.getSessionDay());
        sessionDTO.setSessionType(session.getSessionType());
        sessionDTO.setStartTime(session.getStartTime());
        sessionDTO.setEndTime(session.getEndTime());
        sessionDTO.setByGroup(session.getByGroup());
        sessionDTO.setGroupName(session.getGroupName());
        sessionDTO.setLevelDTO(LevelMapper.toDTO(session.getLevel()));
        sessionDTO.setModuleDTO(ModuleMapper.toDTO(session.getModule()));
        sessionDTO.setProfessorDTO(ProfessorMapper.toDTO(session.getProfessor()));
        return sessionDTO;
    }

    public static Session toEntity(SessionDTO sessionDTO){
        Session session = new Session();
        session.setSessionDay(sessionDTO.getSessionDay());
        session.setSessionType(sessionDTO.getSessionType());
        session.setStartTime(sessionDTO.getStartTime());
        session.setEndTime((sessionDTO.getEndTime()));
        session.setByGroup((sessionDTO.getByGroup()));
        session.setGroupName(sessionDTO.getGroupName());
        session.setLevel(LevelMapper.toEntity(sessionDTO.getLevelDTO()));
        session.setModule(ModuleMapper.toEntity((sessionDTO.getModuleDTO())));
        session.setProfessor(ProfessorMapper.toEntity(sessionDTO.getProfessorDTO()));
        return session;
    }

}
//push