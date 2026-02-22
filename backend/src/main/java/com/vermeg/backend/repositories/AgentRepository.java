package com.vermeg.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vermeg.backend.entities.Agent;

public interface AgentRepository extends JpaRepository<Agent, Long> {
    Optional<Agent> findByCin(String cin);
    Optional<Agent> findByEmail(String email);
}