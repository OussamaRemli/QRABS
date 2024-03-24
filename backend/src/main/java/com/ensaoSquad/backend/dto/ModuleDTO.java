package com.ensaoSquad.backend.dto;
import com.ensaoSquad.backend.model.Department;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor @NoArgsConstructor
public class ModuleDTO {
    private long moduleId;

    private String moduleName;

    private Department department;

}
