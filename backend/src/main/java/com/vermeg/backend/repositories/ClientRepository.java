package com.vermeg.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vermeg.backend.entities.Client;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> { 
    
    
    Optional<Client> findByNcin(int ncin); 
    
 @org.springframework.data.jpa.repository.Query("SELECT c FROM Client c WHERE c.email = :email")
Optional<Client> findByEmail(@org.springframework.data.repository.query.Param("email") String email);

boolean existsByEmail(String email);
}