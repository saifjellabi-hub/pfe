package com.vermeg.backend.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vermeg.backend.entities.DemandeCredit;
import com.vermeg.backend.services.DemandeCreditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.List;
import org.springframework.http.HttpStatus;



@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/credits")
public class CreditController {
    @GetMapping("/all")
    public ResponseEntity<List<DemandeCredit>> getAllDemandes() {
    try {
        List<DemandeCredit> demandes = demandeCreditService.getAllDemandes();
        return ResponseEntity.ok(demandes);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

    @Autowired
    private DemandeCreditService demandeCreditService;

    @PutMapping("/{id}/statut")
public ResponseEntity<DemandeCredit> updateStatut(@PathVariable Long id, @RequestBody String statut) {
    try {
        // On nettoie le statut s'il arrive avec des guillemets
        String cleanStatut = statut.replace("\"", "");
        DemandeCredit updated = demandeCreditService.modifierStatut(id, cleanStatut);
        return ResponseEntity.ok(updated);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}

    @PostMapping(value = "", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createDemande(
            @RequestPart("demande") String demandeJson, 
            @RequestPart(value = "cinFiles", required = false) MultipartFile[] cinFiles,
            @RequestPart(value = "attestFiles", required = false) MultipartFile[] attestFiles,
            @RequestPart(value = "paieFiles", required = false) MultipartFile[] paieFiles) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // Parsing du JSON
            Map<String, Object> map = objectMapper.readValue(demandeJson, new TypeReference<Map<String, Object>>() {});
            
            // Nettoyage pour les enfants
            if (map.get("datesNaissanceEnfants") instanceof java.util.List) {
                map.put("datesNaissanceEnfants", ""); 
            }

            DemandeCredit demande = objectMapper.convertValue(map, DemandeCredit.class);

            // Appel au service avec les 3 types de fichiers
            DemandeCredit result = demandeCreditService.saveDemandeComplete(demande, cinFiles, attestFiles, paieFiles);
            
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            System.err.println("ERREUR LORS DE LA SAUVEGARDE : " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur : " + e.getMessage());
        }
    }
}