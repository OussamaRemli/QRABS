package com.ensaoSquad.backend.service;

import com.ensaoSquad.backend.dto.IncludeDTO;

import java.util.List;

public interface IncludeService {
    IncludeDTO createInclude(IncludeDTO includeDTO);

    List<IncludeDTO> getAllInclude();

}
