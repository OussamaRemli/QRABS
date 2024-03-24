package com.ensaoSquad.backend.mapper;

import com.ensaoSquad.backend.dto.ModuleDto;
import com.ensaoSquad.backend.Model.Module;
import org.springframework.stereotype.Component;

@Component
public class ModuleMapper {
    public static ModuleDto mapToModuleDto(Module module){
        ModuleDto moduleDto=new ModuleDto();
        moduleDto.setModuleId(module.getModuleId());
        moduleDto.setModuleName(module.getModuleName());
        moduleDto.setDepartment(module.getDepartment());
        return moduleDto;
    }

    public static  Module mapToModule(ModuleDto moduleDto){
        Module module=new Module();

        module.setModuleId(moduleDto.getModuleId());
        module.setModuleName(moduleDto.getModuleName());
        module.setDepartment(moduleDto.getDepartment());

        return module;

    }
}
