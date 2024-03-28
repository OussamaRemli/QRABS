package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.Model.Include;
import com.ensaoSquad.backend.Model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository

public interface IncludeRepository extends JpaRepository<Include,Long> {

}
