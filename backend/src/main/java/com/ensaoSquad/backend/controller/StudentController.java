package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.dto.DepartmentDTO;
import com.ensaoSquad.backend.dto.StudentDTO;
import com.ensaoSquad.backend.exception.MultipleFoundException;
import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.exception.UploadExcelException;
import com.ensaoSquad.backend.model.Professor;
import com.ensaoSquad.backend.model.Student;
import com.ensaoSquad.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

        try {
            List<StudentDTO> uploadedStudents = studentService.uploadStudentsFromExcel(file);
            return ResponseEntity.ok(uploadedStudents);
        }catch (UploadExcelException | RessourceNotFoundException | MultipleFoundException ex) {
            // Exception will be caught by the exception handler defined in the controller advice
            throw ex;
        } catch (Exception e) {
            // Other exceptions handling if needed
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/{levelName}/{groupName}")
    public List<StudentDTO> getStudentsByLevelName(@PathVariable String levelName,@PathVariable String groupName){
        if(groupName.equals("none")){
            return studentService.getStudentsByLevelName(levelName);
        }else{
            return studentService.getStudentsByLevelNameAndGroupName(levelName,groupName);
        }
    }
//    @GetMapping("/{levelName}/{groupName}")
//    public List<Student> getStudentsByLevelName(@PathVariable String levelName,@PathVariable String groupName){
//        return studentService.getStudentsByLevelNameAndGroupName(levelName,groupName);
//    }

    @GetMapping("/taughtByProf")
    public List<List<StudentDTO>> getStudentsTaughtByProfessorInTimeframe(
            @RequestParam String professorEmail,
            @RequestParam String sessionDay,
            @RequestParam Time startTime,
            @RequestParam Time endTime
    ) {

        return studentService.getStudentsTaughtByProfessorInTimeframe(professorEmail,sessionDay,startTime,endTime);
    }

    @GetMapping("/student/{apogee}")
    public Student getStudentByApogee(@PathVariable Long apogee){
        return studentService.findByApogee(apogee);
    }
    /*
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }
     */
    @DeleteMapping("/deleteAll")
    public ResponseEntity<Void> deleteAllStudents() {
        boolean studentsExist = studentService.anyStudentsExist(); // Replace with your actual method to check existence

        if (!studentsExist) {
            return ResponseEntity.ok().build(); // Return success if no students exist
        }

        studentService.deleteAllStudent(); // Delete all students
        return ResponseEntity.noContent().build(); // Return success after deletion
    }

}
