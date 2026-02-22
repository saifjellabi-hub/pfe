package com.vermeg.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vermeg.backend.entities.Client;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> { 
    
    
    Optional<Client> findByNcin(int ncin); 
    
    Client findByEmail(String email);
}