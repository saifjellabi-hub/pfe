package com.vermeg.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vermeg.backend.entities.DemandeCredit;

@Repository
public interface DemandeCreditRepository extends JpaRepository<DemandeCredit, Long> {
}
