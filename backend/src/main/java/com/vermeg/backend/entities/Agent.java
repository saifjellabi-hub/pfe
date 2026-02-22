package com.vermeg.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data 
public class Agent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String prenom;
    
    @Column(unique = true)
    private String email;
    
    @Column(unique = true)
    private String cin;
    
    private String phone;
    private String password;
    
    @Column(unique = true)
    private String matricule;
    
    private String role = "AGENT"; // قيمة افتراضية
}