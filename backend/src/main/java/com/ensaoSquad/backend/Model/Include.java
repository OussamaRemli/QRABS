package com.ensaoSquad.backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "include")
@Data
@AllArgsConstructor
@NoArgsConstructor
@IdClass(Include.class)
public class Include implements Serializable {

    @Id
    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module moduleId;

    @Id
    @ManyToOne
    @JoinColumn(name = "level_id")
    private Level levelId;



}
