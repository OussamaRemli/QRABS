package com.ensaoSquad.backend.dto;
import com.ensaoSquad.backend.Model.Department;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor @NoArgsConstructor
public class ModuleDto {
    private long moduleId;

    private String moduleName;

    private Department department;

}
