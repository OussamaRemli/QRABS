package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.dto.IncludeDTO;
import com.ensaoSquad.backend.dto.ModuleDTO;
import com.ensaoSquad.backend.service.IncludeService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/include")
@AllArgsConstructor

public class IncludeController {

    private final IncludeService includeService;

    @PostMapping
    public ResponseEntity<IncludeDTO> createModule(@RequestBody IncludeDTO includeDTO){

        IncludeDTO SavedInclude=includeService.createInclude(includeDTO);
        return new ResponseEntity<>(SavedInclude, HttpStatus.CREATED);
    }

    @GetMapping
    public  ResponseEntity<List<IncludeDTO>> getAllInclude(){
        return ResponseEntity.ok(includeService.getAllInclude());
    }
}
