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

@RestController
@RequestMapping("/api/credits")
@CrossOrigin(origins = "http://localhost:4200")
public class CreditController {

    @Autowired
    private DemandeCreditService demandeCreditService;

    @PostMapping(value = "", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createDemande(
            @RequestPart("demande") String demandeJson, 
            @RequestPart(value = "files", required = false) MultipartFile[] files) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // On lit le JSON dans une Map pour nettoyer les données
            Map<String, Object> map = objectMapper.readValue(demandeJson, new TypeReference<Map<String, Object>>() {});
            
            // Correction pour éviter le crash sur le tableau vide des enfants
            if (map.get("datesNaissanceEnfants") instanceof java.util.List) {
                map.put("datesNaissanceEnfants", ""); 
            }

            // Conversion finale vers l'objet Java
            DemandeCredit demande = objectMapper.convertValue(map, DemandeCredit.class);

            // Sauvegarde complète (BDD + Fichiers)
            DemandeCredit result = demandeCreditService.saveDemandeComplete(demande, files);
            
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            System.err.println("ERREUR LORS DE LA SAUVEGARDE : " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("CAUSE REELLE : " + e.getCause().getMessage());
            }
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur : " + e.getMessage());
        }
    }
}