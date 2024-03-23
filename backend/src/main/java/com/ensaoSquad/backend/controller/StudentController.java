package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.dto.StudentDTO;
import com.ensaoSquad.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/students")
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
}
