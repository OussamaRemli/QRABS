package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.dto.ProfessorDTO;
import com.ensaoSquad.backend.mapper.ProfessorMapper;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.repository.ProfessorRepository;
import com.ensaoSquad.backend.service.ProfessorService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProfessorServiceImpl implements ProfessorService {


    private final ProfessorRepository professorRepository;



    @Override
    public ProfessorDTO save(ProfessorDTO professorDto) {
        Professor professor = ProfessorMapper.toEntity(professorDto);
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
        Professor professor = professorRepository.findById(id).orElse(null);
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
}