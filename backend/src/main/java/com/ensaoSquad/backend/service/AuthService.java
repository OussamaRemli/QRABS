package com.ensaoSquad.backend.service;
import com.ensaoSquad.backend.dto.LoginDTO;
import com.ensaoSquad.backend.repository.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    public boolean authenticate(LoginDTO loginDTO);
}
