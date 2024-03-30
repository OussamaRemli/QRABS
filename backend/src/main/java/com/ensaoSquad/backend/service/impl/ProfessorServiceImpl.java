package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.dto.ProfessorDTO;
import com.ensaoSquad.backend.mapper.DepartmentMapper;
import com.ensaoSquad.backend.mapper.ProfessorMapper;
import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.repository.DepartmentRepository;
import com.ensaoSquad.backend.repository.ProfessorRepository;
import com.ensaoSquad.backend.service.ProfessorService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProfessorServiceImpl implements ProfessorService {

    @Autowired
    private final ProfessorRepository professorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;



    @Override
    public ProfessorDTO save(ProfessorDTO professorDto) {
        Professor professor = ProfessorMapper.toEntity(professorDto);
        professor.setPassword(passwordEncoder.encode(professor.getPassword()));
        professor = professorRepository.save(professor);
        return ProfessorMapper.toDTO(professor);
    }

    @Override
    public List<ProfessorDTO> findAll() {
        return professorRepository.findAll()
                .stream()
                .map(ProfessorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProfessorDTO findById(Long id) {
        Professor professor = professorRepository.findById(id).orElseThrow(() -> new RuntimeException("Professor not found with id: "+id));
        return professor != null ? ProfessorMapper.toDTO(professor) : null;
    }

    @Override
    public ProfessorDTO findByName(String lastName) {
        Professor professor = professorRepository.findByLastName(lastName).orElse(null);
        return professor != null ? ProfessorMapper.toDTO(professor) : null;    }

    @Override
    public void delete(Long id) {
        professorRepository.deleteById(id);
    }

    @Override
    public ProfessorDTO update(ProfessorDTO professorDTO){
        Professor existingProfessor=ProfessorMapper.toEntity(professorDTO);
         existingProfessor = professorRepository.findById(professorDTO.getProfessorId())
                .orElseThrow(() -> new RuntimeException("Professor not found"));
        existingProfessor.setFirstName(professorDTO.getFirstName());
        existingProfessor.setLastName(professorDTO.getLastName());
        existingProfessor.setEmail(professorDTO.getEmail());
        existingProfessor.setDepartment(DepartmentMapper.toEntity(professorDTO.getDepartment()));

        // Encode the new password if it's not empty
        if (!professorDTO.getPassword().isEmpty()) {
            existingProfessor.setPassword(passwordEncoder.encode(professorDTO.getPassword()));
        }
        existingProfessor= professorRepository.save(existingProfessor);
        return ProfessorMapper.toDTO(existingProfessor);
    }
}