package com.ensaoSquad.backend.dto;

import com.ensaoSquad.backend.Model.Level;
import com.ensaoSquad.backend.Model.Module;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class IncludeDTO {
    private Module moduleId;
    private Level levelId;
}
