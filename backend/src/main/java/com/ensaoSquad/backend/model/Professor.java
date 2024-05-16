package com.ensaoSquad.backend.model;
import com.ensaoSquad.backend.model.Department;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "professor")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Professor {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private long professorId ;
    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    @Column(nullable = false ,unique = true)
    private String email;
    @Column(nullable = false)
    private String password ;
    @Column(nullable = false)
    private String role = "ROLE_PROFESSOR"; // Valeur par défaut "ROLE_PROFESSOR"

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
}
