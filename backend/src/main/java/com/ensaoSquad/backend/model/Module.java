package com.ensaoSquad.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "module")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "moduleI_id")
    private long moduleId;
    @Column(name = "moduleName" ,nullable = false ,unique = true)
    private String moduleName;

    @ManyToOne
    @JoinColumn(name ="department_id")
    Department department;
}
