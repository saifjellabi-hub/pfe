package com.vermeg.backend.repositories;

import com.vermeg.backend.entities.DemandeCredit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DemandeCreditRepository extends JpaRepository<DemandeCredit, Long> {
    List<DemandeCredit> findByNcin(String ncin);
    // Ne rien ajouter ici pour l'instant
}