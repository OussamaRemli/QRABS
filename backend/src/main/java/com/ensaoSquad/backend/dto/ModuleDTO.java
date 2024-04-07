package com.ensaoSquad.backend.dto;
import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Professor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor @NoArgsConstructor
public class ModuleDTO {
    private long moduleId;

    private String moduleName;

    private Department department;

    private String intituleModule;

    private  String NameByDepartment;

    private Professor professor;

    private Level level;

}
