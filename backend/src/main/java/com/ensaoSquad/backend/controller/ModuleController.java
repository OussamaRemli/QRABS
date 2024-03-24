package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.dto.ModuleDTO;
import com.ensaoSquad.backend.service.ModuleService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/modules","/api/modules"})
@AllArgsConstructor
public class ModuleController {
    private final  ModuleService moduleService;

    @PostMapping
    public ResponseEntity<ModuleDTO> createModule(@RequestBody ModuleDTO ModuleDTO){


        ModuleDTO SavedModule=moduleService.createModule(ModuleDTO);
        return new ResponseEntity<>(SavedModule, HttpStatus.CREATED);
    }

    @GetMapping

    public  ResponseEntity<List<ModuleDTO>> getAllModule(){
        return ResponseEntity.ok(moduleService.getAllModule());
    }

    @GetMapping("/{name}")

    public ResponseEntity<ModuleDTO> findByModuleName(@PathVariable String name){
        return ResponseEntity.ok(moduleService.findModuleByName(name));
    }



}
