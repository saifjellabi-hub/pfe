package com.vermeg.backend.services;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import com.vermeg.backend.entities.DemandeCredit;
import com.vermeg.backend.repositories.DemandeCreditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;
@Service
public class DemandeCreditService {

    @Autowired
    private DemandeCreditRepository repository;

    private final Path root = Paths.get("uploads");

    @Transactional
    public DemandeCredit saveDemandeComplete(DemandeCredit demande, MultipartFile[] files) throws IOException {
        // 1. Création du dossier uploads s'il n'existe pas
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        // 2. Traitement des fichiers
        StringBuilder fileNames = new StringBuilder();
        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String uniqueName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                    Files.copy(file.getInputStream(), this.root.resolve(uniqueName), StandardCopyOption.REPLACE_EXISTING);
                    fileNames.append(uniqueName).append(";");
                }
            }
        }

        // 3. On attache les noms des fichiers à l'entité
        demande.setJustificatifUrl(fileNames.toString());

        // 4. SAUVEGARDE EN BASE DE DONNÉES
        System.out.println("Tentative d'enregistrement en base de données pour : " + demande.getNom());
        return repository.save(demande);
    }
}