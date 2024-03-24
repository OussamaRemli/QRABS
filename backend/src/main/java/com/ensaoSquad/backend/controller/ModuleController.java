package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.Model.Department;
import com.ensaoSquad.backend.dto.ModuleDto;
import com.ensaoSquad.backend.mapper.ModuleMapper;
import com.ensaoSquad.backend.service.ModuleService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<ModuleDto> createModule(@RequestBody ModuleDto moduleDto){




        ModuleDto SavedModule=moduleService.createModule(moduleDto);
        return new ResponseEntity<>(SavedModule, HttpStatus.CREATED);
    }

    @GetMapping

    public  ResponseEntity<List<ModuleDto>> getAllModule(){
        return ResponseEntity.ok(moduleService.getAllModule());
    }

    @GetMapping("/{name}")

    public ResponseEntity<ModuleDto> findByModuleName(@PathVariable String name){
        return ResponseEntity.ok(moduleService.findModuleByName(name));
    }



}
