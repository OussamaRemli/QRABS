package com.ensaoSquad.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "include")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Include {

    @Id
    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module moduleId;

    @Id
    @ManyToOne
    @JoinColumn(name = "level_id")
    private Level levelId;



}
