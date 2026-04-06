package com.vermeg.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vermeg.backend.entities.DemandeCredit;

@Repository
public interface DemandeCreditRepository extends JpaRepository<DemandeCredit, Long> {

List<DemandeCredit> findByNomClient(String nomClient);
}
