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

    @Column(name = "module_name", nullable = false)
    private String moduleName;

    @Column(name="Intitule_Module" , nullable = false )
    private String intituleModule;

    @Column(name="Name_By_Department",nullable = false)
    private  String NameByDepartment;

    @ManyToOne
    @JoinColumn(name="id_professeur")
    private Professor professor;

    @ManyToOne
    @JoinColumn(name ="department_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "level_id")
    private Level level;


}
