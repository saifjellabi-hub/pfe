package com.vermeg.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "clients")
@Data
public class Client {

    @Id 
    @Column(length = 8)
    private int ncin; 

    private String nom;
    private String prenom;

    @Column(unique = true)
    private String email;

    private int age;
    private int tel;
    private double soldeInitial;
    @Column(length = 20, unique = true) 
    private String rib;
    private String password;
    
private String role = "USER"; 
 private boolean isFirstLogin = true; 
public int getNcin() {
    return ncin;
}
public void setNcin(int ncin) {
        this.ncin = ncin;
    }
public String getPassword() {
    return password;
}
public void setPassword(String password) {
    this.password = password;
}
public String getRole() {
    return role;
}
public void setRole(String role) {
        this.role = role;
    }

public boolean isIsFirstLogin() {
    return isFirstLogin;
}

public void setIsFirstLogin(boolean isFirstLogin) {
    this.isFirstLogin = isFirstLogin;
}
public String getRib() { return rib; }
public void setRib(String rib) { this.rib = rib; }

}
