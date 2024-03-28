package com.ensaoSquad.backend.mapper;

import com.ensaoSquad.backend.model.Include;
import com.ensaoSquad.backend.dto.IncludeDTO;
import org.springframework.stereotype.Component;

@Component
public class IncludeMapper {

    public static IncludeDTO ToDto(Include include){
        IncludeDTO includeDTO=new IncludeDTO();
        includeDTO.setModuleId(include.getModuleId());
        includeDTO.setLevelId(include.getLevelId());
        return includeDTO;
    }

    public static Include ToEntity(IncludeDTO includeDTO){

        Include include=new Include();
        include.setModuleId(includeDTO.getModuleId());
        include.setLevelId(includeDTO.getLevelId());
        return include;
    }
}
