package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.model.Department;
import com.ensaoSquad.backend.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModuleRepository extends JpaRepository<Module,Long> {


    Optional<Module> findByModuleName(String name);
}
