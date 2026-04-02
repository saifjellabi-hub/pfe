package com.vermeg.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.vermeg.backend.entities.DemandeCredit;
import com.vermeg.backend.repositories.DemandeCreditRepository;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Service
public class DemandeCreditService {

    @Autowired
    private DemandeCreditRepository demandeRepository;

    public DemandeCredit saveWithFiles(DemandeCredit demande, MultipartFile[] files) throws IOException {
        String uploadDir = "uploads/justificatifs/";
        File directory = new File(uploadDir);
        
        if (!directory.exists()) {
            directory.mkdirs();
        }

        List<String> fileNames = new ArrayList<>();

        for (MultipartFile file : files) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir + fileName);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            fileNames.add(fileName);
        }

        demande.setJustificatifUrl(String.join(", ", fileNames));
        return demandeRepository.save(demande);
    }
}