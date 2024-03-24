package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.dto.LoginDTO;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.repository.AuthRepository;
import com.ensaoSquad.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImp implements AuthService {

    @Autowired
    private AuthRepository authRepository;

    public boolean authenticate(LoginDTO loginDTO) {
        Professor professor = authRepository.findByEmail(loginDTO.getEmail());

        // Vérifier si l'utilisateur avec l'email donné existe dans la base de données
        if (professor == null) {
            return false;
        }

        // Vérifier si le mot de passe correspond
        return professor.getPassword().equals(loginDTO.getPassword());
    }
    public Professor findProfessorById(Long id) {
        return authRepository.findByProfessorId(id);
    }
}
