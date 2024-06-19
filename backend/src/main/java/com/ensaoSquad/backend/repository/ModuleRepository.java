package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Module;
import com.ensaoSquad.backend.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModuleRepository extends JpaRepository<Module,Long> {


    Optional<Module> findByModuleName(String name);

    Optional<Module> findByModuleId(Long id);
    List<Module> findByProfessor(Professor professor);
    List<Module> findByLevel(Level level);
    List<Module> findByDepartmentDepartmentName(String departmentName);
    List<Module> findByLevelLevelName(String levelName);
    boolean existsByModuleNameAndLevel_LevelId(String moduleName, Long levelId);
    boolean existsByModuleName(String moduleName);

    Module findByModuleNameAndLevel(String moduleName,Level level);


}
