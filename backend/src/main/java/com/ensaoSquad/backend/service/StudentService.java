package com.ensaoSquad.backend.service;

import com.ensaoSquad.backend.dto.StudentDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

public interface StudentService {
    List<StudentDTO> uploadStudentsFromExcel(MultipartFile file);
}
