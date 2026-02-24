package com.vermeg.backend.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vermeg.backend.entities.Agent;
import com.vermeg.backend.repositories.AgentRepository; 

@RestController
@RequestMapping("/api/agents")
@CrossOrigin(origins = "http://localhost:4200")
public class AgentController {

    @Autowired
    private AgentRepository agentRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerAgent(@RequestBody Agent agent) {
        if (agentRepository.findByCin(agent.getCin()).isPresent()) {
            return ResponseEntity.badRequest().body("Erreur : CIN déjà utilisé !");
        }
        return ResponseEntity.ok(agentRepository.save(agent));
    }
    
@GetMapping("/all")
public List<Agent> getAllAgents() {
    return agentRepository.findAll();
}

    @PostMapping("/login")
    public ResponseEntity<?> loginAgent(@RequestBody Map<String, String> payload) {
        String cin = payload.get("cin");
        String password = payload.get("password");

        return agentRepository.findByCin(cin)
            .map(agent -> {
                if (agent.getPassword().equals(password)) {
                    return ResponseEntity.ok(agent);
                }
                return ResponseEntity.status(401).body("Mot de passe incorrect");
            })
            .orElse(ResponseEntity.status(404).body("Agent non trouvé"));
    }


@DeleteMapping("/delete/{id}")
public ResponseEntity<?> deleteAgent(@PathVariable Long id) {
    return agentRepository.findById(id).map(agent -> {
        agentRepository.delete(agent);
        return ResponseEntity.ok().body("{\"message\": \"Agent supprimé\"}");
    }).orElse(ResponseEntity.notFound().build());
}

@PutMapping("/update/{id}")
public ResponseEntity<?> updateAgent(@PathVariable Long id, @RequestBody Agent agentDetails) {
    return agentRepository.findById(id).map(agent -> {
        agent.setCin(agentDetails.getCin());
        agent.setNom(agentDetails.getNom());
        agent.setPrenom(agentDetails.getPrenom());
        agent.setEmail(agentDetails.getEmail());
        agent.setPhone(agentDetails.getPhone());
        agent.setMatricule(agentDetails.getMatricule());
        agent.setPassword(agentDetails.getPassword());
        return ResponseEntity.ok(agentRepository.save(agent));
    }).orElse(ResponseEntity.notFound().build());
}
}