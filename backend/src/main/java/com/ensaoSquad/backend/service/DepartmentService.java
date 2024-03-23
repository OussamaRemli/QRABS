package com.ensaoSquad.backend.service;

import com.ensaoSquad.backend.Model.Professor;
import com.ensaoSquad.backend.dto.DepartmentDTO;
import com.ensaoSquad.backend.dto.LoginDTO;
import com.ensaoSquad.backend.repository.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

public interface DepartmentService {
    DepartmentDTO createDepartment(DepartmentDTO departmentDTO);
    List<DepartmentDTO> getAllDepartment();

    DepartmentDTO findDepartmentByName(String name);

    @Service
    class AuthService {

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
    }
}
