package com.ensaoSquad.backend.dto;

import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Module;
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
