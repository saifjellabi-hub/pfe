package com.vermeg.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;
import java.util.List;
import com.vermeg.backend.entities.DemandeCredit;
import com.vermeg.backend.repositories.DemandeCreditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DemandeCreditService {

    @Autowired
    private DemandeCreditRepository repository;

    @Autowired
    private RestTemplate restTemplate;

    private final Path root = Paths.get("uploads");

    // 1. Récupérer toutes les demandes (Nouveau)
    public List<DemandeCredit> getAllDemandes() {
        return repository.findAll();
    }

    // 2. Modifier le statut (Nouveau)
    @Transactional
    public DemandeCredit modifierStatut(Long id, String nouveauStatut) {
        DemandeCredit demande = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Demande non trouvée"));
        demande.setStatut(nouveauStatut);
        return repository.save(demande);
    }

    @Transactional
    public DemandeCredit saveDemandeComplete(DemandeCredit demande, 
                                            MultipartFile[] cinFiles, 
                                            MultipartFile[] attestFiles, 
                                            MultipartFile[] paieFiles) throws IOException {
        
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        demande.setUrlCin(saveFiles(cinFiles, "cin"));
        demande.setUrlAttestation(saveFiles(attestFiles, "attestations"));
        demande.setUrlFichesPaie(saveFiles(paieFiles, "fiches_paie"));

        try {
            String fastapiUrl = "http://localhost:8000/predict";
            PredictionResponse response = restTemplate.postForObject(fastapiUrl, demande, PredictionResponse.class);
            
            if (response != null) {
                demande.setScoreIA(response.getScore());
                if (response.getScore() >= 70) {
                    demande.setStatut("VALIDE");
                } else if (response.getScore() >= 40) {
                    demande.setStatut("A_ETUDIER");
                } else {
                    demande.setStatut("REFUSE");
                }
            }
        } catch (Exception e) {
            demande.setScoreIA(0.0);
            demande.setStatut("ERREUR_IA");
        }

        return repository.save(demande);
    } // <--- L'accolade qui manquait probablement ici !

    private String saveFiles(MultipartFile[] files, String subFolder) throws IOException {
        if (files == null || files.length == 0) return "";

        Path folderPath = this.root.resolve(subFolder);
        if (!Files.exists(folderPath)) {
            Files.createDirectories(folderPath);
        }

        StringBuilder fileNames = new StringBuilder();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String uniqueName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Files.copy(file.getInputStream(), folderPath.resolve(uniqueName), StandardCopyOption.REPLACE_EXISTING);
                fileNames.append(subFolder).append("/").append(uniqueName).append(";");
            }
        }
        return fileNames.toString();
    }
}

// Garde la classe PredictionResponse en bas si elle n'est pas dans un fichier séparé
class PredictionResponse {
    private double score;
    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }
}