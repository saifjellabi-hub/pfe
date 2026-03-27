package com.vermeg.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.vermeg.backend.entities.DemandeCredit;
import com.vermeg.backend.repositories.DemandeCreditRepository;

@RestController
@RequestMapping("/api/demandes")
@CrossOrigin(origins = "http://localhost:4200") // باش يخلي Angular يكلمو
public class DemandeCreditController {

    @Autowired
    private DemandeCreditRepository repository;

    @Autowired
    private RestTemplate restTemplate;

 @PostMapping
public DemandeCredit createDemande(@RequestBody DemandeCredit demande) {
    // نحينا مؤقتا كلام الـ Flask باش نجربو الـ DB
    demande.setStatus("En attente");
    return repository.save(demande); 
}
}