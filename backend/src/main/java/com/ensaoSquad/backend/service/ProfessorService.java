package com.ensaoSquad.backend.service;
import com.ensaoSquad.backend.dto.ProfessorDTO;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Professor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ProfessorService {
    ProfessorDTO save(ProfessorDTO professorDto);

    List<ProfessorDTO> saveByExcel(MultipartFile file);
    List<ProfessorDTO> findAll();
    ProfessorDTO findById(Long id);

    ProfessorDTO findByName(String name);
    Optional<ProfessorDTO> findByEmail(String email);
    List<ProfessorDTO> findByDepartmentName(String departmentName);

    void delete(Long id);
    ProfessorDTO update(ProfessorDTO professorDto);

    List<Professor> findByFirstNameAndLastName(String firstName,String lastName);
//    Optional<Professor> findByFirstNameAndLastName(String firstName,String lastName);
    public void updateEmail(Long professorId, String newEmail);
    public void updatePassword(Long professorId, String newPassword);


}