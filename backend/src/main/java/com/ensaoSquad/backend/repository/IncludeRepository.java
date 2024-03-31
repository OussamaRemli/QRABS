package com.ensaoSquad.backend.repository;

import com.ensaoSquad.backend.model.Include;
import com.ensaoSquad.backend.model.Level;
import com.ensaoSquad.backend.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository

public interface IncludeRepository extends JpaRepository<Include,Long> {

    @Modifying
    @Query("DELETE FROM Include i WHERE i.levelId = :level")
    void deleteByLevel(@Param("level") Level level);


}
