package com.ensaoSquad.backend.service.impl;


import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private  ProfessorRepository professorRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Professor professor = professorRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Professor not found with email: " + email));
//        System.out.println(professor.getRole());
        return org.springframework.security.core.userdetails.User.builder()
                .username(professor.getEmail())
                .password(professor.getPassword())
                .authorities(professor.getRole())
                .build();
    }
}

