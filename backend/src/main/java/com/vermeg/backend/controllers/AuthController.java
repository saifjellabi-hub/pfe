package com.vermeg.backend.controllers;

import com.vermeg.backend.entities.Agent;
import com.vermeg.backend.repositories.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AgentRepository agentRepository;

    @PostMapping("/agent-login")
    public ResponseEntity<?> loginAgent(@RequestBody Map<String, String> credentials) {
    String matricule = credentials.get("matricule");
    String password = credentials.get("password");

    Optional<Agent> agentOpt = agentRepository.findByMatricule(matricule);

    if (agentOpt.isPresent() && agentOpt.get().getPassword().equals(password)) {
        return ResponseEntity.ok(agentOpt.get());
    } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Matricule ou mot de passe incorrect");
    }
}
}