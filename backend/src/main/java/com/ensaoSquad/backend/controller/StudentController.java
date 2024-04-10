package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.dto.DepartmentDTO;
import com.ensaoSquad.backend.dto.StudentDTO;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.model.Student;
import com.ensaoSquad.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Time;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadStudentsFromExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Uploaded file is empty");
        }

        List<StudentDTO> uploadedStudents = studentService.uploadStudentsFromExcel(file);
        return ResponseEntity.ok(uploadedStudents);
    }
    @GetMapping("/{levelName}")
    public List<StudentDTO> getStudentsByLevelName(@PathVariable String levelName){
        return studentService.getStudentsByLevelName(levelName);
    }

    @GetMapping("/taughtByProf")
    public List<List<StudentDTO>> getStudentsTaughtByProfessorInTimeframe(
            @RequestParam String professorEmail,
            @RequestParam String sessionDay,
            @RequestParam Time startTime,
            @RequestParam Time endTime
    ) {

        return studentService.getStudentsTaughtByProfessorInTimeframe(professorEmail,sessionDay,startTime,endTime);
    }
}
