package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.dto.ProfessorDTO;
import com.ensaoSquad.backend.mapper.ProfessorMapper;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.repository.ProfessorRepository;
import com.ensaoSquad.backend.service.ProfessorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorServiceImpl implements ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private ProfessorMapper professorMapper;

    @Override
    public ProfessorDTO save(ProfessorDTO professorDto) {
        Professor professor = professorMapper.toEntity(professorDto);
        professor = professorRepository.save(professor);
        return professorMapper.toDto(professor);
    }

    @Override
    public List<ProfessorDTO> findAll() {
        return professorRepository.findAll()
                .stream()
                .map(professorMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProfessorDTO findById(Long id) {
        Professor professor = professorRepository.findById(id).orElse(null);
        return professor != null ? professorMapper.toDto(professor) : null;
    }

    @Override
    public void delete(Long id) {
        professorRepository.deleteById(id);
    }
}