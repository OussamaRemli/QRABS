package com.ensaoSquad.backend.mapper;

import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.dto.LoginDTO;

public class LoginMapper {

    public static LoginDTO EntityToLoginDTO(Professor professor) {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail(professor.getEmail());
        loginDTO.setPassword(professor.getPassword());
        return loginDTO;
    }

    public static Professor DTOToEntity(LoginDTO loginDTO) {
        Professor professor = new Professor();
        professor.setEmail(loginDTO.getEmail());
        professor.setPassword(loginDTO.getPassword());
        return professor;
    }
}
