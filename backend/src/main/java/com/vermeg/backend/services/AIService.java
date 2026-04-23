package com.vermeg.backend.services;

import org.springframework.stereotype.Service;
import com.vermeg.backend.entities.DemandeCredit;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class AIService {
    public double calculerScore(DemandeCredit demande) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:5000/predict";
            Map<String, Object> req = new HashMap<>();
            req.put("age", demande.getAge());
            req.put("montant", demande.getMontant());
            req.put("revenu", demande.getRevenuMensuel());
            // Ajoute d'autres champs si besoin
            Map<String, Object> response = restTemplate.postForObject(url, req, Map.class);
            return response != null ? Double.valueOf(response.get("score").toString()) : 0.0;
        } catch (Exception e) {
            return 0.0;
        }
    }
}