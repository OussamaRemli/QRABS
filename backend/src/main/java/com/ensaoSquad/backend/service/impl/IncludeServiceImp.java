package com.ensaoSquad.backend.service.impl;

import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Include;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.dto.IncludeDTO;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.mapper.IncludeMapper;
import com.ensaoSquad.backend.repository.IncludeRepository;
import com.ensaoSquad.backend.repository.LevelRepository;
import com.ensaoSquad.backend.repository.ModuleRepository;
import com.ensaoSquad.backend.service.IncludeService;
import com.ensaoSquad.backend.service.LevelService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@AllArgsConstructor

public class IncludeServiceImp implements IncludeService {

    private final IncludeRepository includeRepository;
    private final ModuleRepository moduleRepository;
    private final LevelRepository levelRepository;
    @Override
    public IncludeDTO createInclude(IncludeDTO includeDTO) {
        Module module = moduleRepository.findById(includeDTO.getModuleId().getModuleId())
                .orElseThrow(() -> new RessourceNotFoundException("Module not found with ID: " + includeDTO.getModuleId().getModuleId()));
        Level level=levelRepository.findById(includeDTO.getLevelId().getLevelId())
                .orElseThrow(() ->new RessourceNotFoundException("Level not found with ID: " + includeDTO.getLevelId().getLevelId()));

        Include include = new Include();

        include.setModuleId(module);
        include.setLevelId(level);
        Include savedInclude=includeRepository.save(include);
        return IncludeMapper.ToDto(savedInclude);
    }

    @Override
    public List<IncludeDTO> getAllInclude() {
        List<IncludeDTO> includeDTOList=includeRepository.findAll().stream().map(IncludeMapper::ToDto).toList();
        return includeDTOList;
    }




    }

