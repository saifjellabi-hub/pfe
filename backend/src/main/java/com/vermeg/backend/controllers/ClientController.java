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

import com.vermeg.backend.entities.Client;
import com.vermeg.backend.repositories.ClientRepository;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

   
    @PostMapping("/register")
    public ResponseEntity<?> registerClient(@RequestBody Client client) {
       
        if (clientRepository.findByNcin(client.getNcin()).isPresent()) {
            return ResponseEntity.badRequest().body("Erreur : Ce numéro de CIN est déjà utilisé !");
        }
        
        
        Client savedClient = clientRepository.save(client);
        return ResponseEntity.ok(savedClient);
    }


    @GetMapping("/all")
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }
  @PostMapping("/login")
public ResponseEntity<?> loginClient(@RequestBody Map<String, String> payload) {
    int ncin = Integer.parseInt(payload.get("ncin"));
    String password = payload.get("password");
    String newPassword = payload.get("newPassword");

    return clientRepository.findByNcin(ncin)
        .map(client -> {
            if (!"USER".equals(client.getRole())) {
                return ResponseEntity.status(403).body("Accès refusé : Cette interface est réservée aux clients.");
            }
            if (client.getPassword().equals(password)) {
                

                if (client.isIsFirstLogin()) {
                    if (newPassword != null && !newPassword.isEmpty()) {
                        client.setPassword(newPassword); 
                        client.setIsFirstLogin(false);   
                        clientRepository.save(client);
                        return ResponseEntity.ok(client);
                    } else {
                      
                        return ResponseEntity.status(206).body("PREMIERE_CONNEXION");
                    }
                }
                
              
                return ResponseEntity.ok(client);
            } else {
                return ResponseEntity.status(401).body("Mot de passe incorrect !");
            }
        })
        .orElse(ResponseEntity.status(404).body("Client non trouvé !"));
}
@PostMapping("/admin/login")
public ResponseEntity<?> loginAdmin(@RequestBody Client loginDetails) {
    return clientRepository.findByNcin(loginDetails.getNcin())
        .map(user -> {
            if (user.getPassword().equals(loginDetails.getPassword()) && "ADMIN".equals(user.getRole())) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(401).body("Accès refusé : Identifiants incorrects ");
            }
        })
        .orElse(ResponseEntity.status(404).body("Administrateur non trouvé"));
}
@DeleteMapping("/delete/{ncin}")
public ResponseEntity<?> deleteClient(@PathVariable int ncin) {
    return clientRepository.findById(ncin).map(client -> {
        clientRepository.delete(client);
        return ResponseEntity.ok().body("{\"message\": \"Client supprimé\"}");
    }).orElse(ResponseEntity.notFound().build());
}

@PutMapping("/update/{ncin}")
public ResponseEntity<?> updateClient(@PathVariable int ncin, @RequestBody Client clientDetails) {
    return clientRepository.findById(ncin).map(client -> {
        client.setNom(clientDetails.getNom());
        client.setPrenom(clientDetails.getPrenom());
        client.setAge(clientDetails.getAge());
        client.setEmail(clientDetails.getEmail());
        client.setTel(clientDetails.getTel());
        client.setSoldeInitial(clientDetails.getSoldeInitial());
        client.setRib(clientDetails.getRib());

        return ResponseEntity.ok(clientRepository.save(client));
    }).orElse(ResponseEntity.notFound().build());
}
}
