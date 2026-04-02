package com.vermeg.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType; // مهم جداً
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vermeg.backend.entities.DemandeCredit;
import com.vermeg.backend.repositories.DemandeCreditRepository;
import com.vermeg.backend.services.DemandeCreditService;

@RestController
@RequestMapping("/api/demandes")
@CrossOrigin(origins = "http://localhost:4200")
public class DemandeCreditController {

    @Autowired
    private DemandeCreditRepository repository;

    @Autowired
    private DemandeCreditService demandeService; // تأكد من الاسم هوني

    @PostMapping(value = "", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createDemande(
            @RequestPart("demande") String demandeJson, 
            @RequestPart("files") MultipartFile[] files) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            // استعملنا DemandeCredit خاطر هذا اسم الـ Entity متاعك
            DemandeCredit demande = objectMapper.readValue(demandeJson, DemandeCredit.class);
            
            DemandeCredit savedDemande = demandeService.saveWithFiles(demande, files);
            return ResponseEntity.ok(savedDemande);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    @GetMapping("/client/{ncin}")
    public DemandeCredit getDemandeByClient(@PathVariable String ncin) {
        return repository.findByNcin(ncin).orElse(null);
    }
}