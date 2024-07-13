package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.dto.LevelDTO;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.repository.LevelRepository;
import com.ensaoSquad.backend.service.LevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/levels","/api/levels/"})
@CrossOrigin(origins = "*")
public class LevelController {

    @Autowired
    private LevelService levelService;

    @Autowired
    private LevelRepository levelRepository;

    @PostMapping
    public ResponseEntity<LevelDTO> createLevel(@RequestBody LevelDTO levelDTO) {
        LevelDTO createdLevel = levelService.createLevel(levelDTO);
        return new ResponseEntity<>(createdLevel, HttpStatus.CREATED);
    }



    @PostMapping("/createFiliere")
    public ResponseEntity<List<LevelDTO>> addSectorData(@RequestBody String sectorAbbreviation) {
        List<LevelDTO> entities = levelService.saveSectorData(sectorAbbreviation);
        return new ResponseEntity<>(entities, HttpStatus.CREATED);
    }


    @GetMapping("/{levelName}")
    public ResponseEntity<LevelDTO> getLevelByName(@PathVariable String levelName) {
        LevelDTO levelDTO = levelService.getLevelByName(levelName);
        return ResponseEntity.ok(levelDTO);
    }

    @GetMapping
    public ResponseEntity<List<LevelDTO>> getAllLevels() {
        List<LevelDTO> levels = levelService.getAllLevels();
        return ResponseEntity.ok(levels);
    }

    @GetMapping("/curentlevel/{id}")
    public List<LevelDTO> getCurrentLevel(@PathVariable Long id) {
        return levelService.getCurrentLevel(id);
    }

    @GetMapping("/has-schedule")
    public ResponseEntity<Boolean> checkLevelSchedule(@RequestParam String levelName) {
        boolean hasSchedule = levelService.levelHasSchedule(levelName);
        return ResponseEntity.ok(hasSchedule);
    }

    @GetMapping("/has-students")
    public ResponseEntity<Boolean> checkLevelStudents(@RequestParam String levelName) {
        boolean hasStudents = levelService.levelHasStudents(levelName);
        return ResponseEntity.ok(hasStudents);
    }

    @PutMapping("/{id}")
    public Level updateLevel(@PathVariable long id, @RequestBody Level updatedLevel) {
        Level existingLevel = levelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Filière introuvable avec l'ID : " + id));

        existingLevel.setLevelName(updatedLevel.getLevelName());
        existingLevel.setSectorName(updatedLevel.getSectorName());

        return levelRepository.save(existingLevel);
    }

    @DeleteMapping("/{id}")
    public void deleteLevel(@PathVariable long id) {
        levelRepository.deleteById(id);
    }
}
