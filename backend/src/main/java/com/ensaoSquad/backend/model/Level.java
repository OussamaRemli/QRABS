package com.ensaoSquad.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "level")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Level {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long levelId;
    @Column(nullable = false ,unique = true)
    private String levelName;
    @Column(nullable = false)
    private String sectorName;
}
