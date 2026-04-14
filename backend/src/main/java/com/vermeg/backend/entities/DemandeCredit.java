package com.vermeg.backend.entities;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DemandeCredit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_ncin", nullable = false)
    private String ncin;

    private Double montant;
    private Integer duree; 
    private String objetCredit;
    private Double revenuMensuel;
    
    @Column(name = "mensualitésCréditsActuels")
    private Double autresCredits;
    
    private String garantie;
    private Double pensionAlimentaire;

    // --- NOUVEAUX CHAMPS ENTREPRISE ---
    private String nomEntreprise;
    private String secteurActivite;
    private String typeEmploi; // CDI, CDD, etc.
    private String telephoneEmployeur;
    private LocalDate dateEmbauche; 
    // ----------------------------------

    private String professionDetail;
    private Integer anciennete;
    private Integer age;
    private String situationFamiliale;
    private Integer nbEnfants;
    private String agesEnfants; 
    
    @Column(name = "Lien_Justificatif")
    private String justificatifUrl; 

    private Double tauxInteret;
    private Double dtiRatio;
    private String decisionIA; 
    private Double scoreIA;   
    private String statut = "EN_ATTENTE";
}