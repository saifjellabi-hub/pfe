package com.vermeg.backend.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

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

    @Column(name = "client_ncin", nullable = true)
    private String ncin;

    private String nom;
    private String prenom;
    private String genre; 

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateNaissance;

    private Integer age;
    private String situationFamiliale;
    private Double pensionAlimentaire;
    private Integer nbEnfants;
    
    @Column(columnDefinition = "TEXT")
    private String datesNaissanceEnfants; 

    private String nomEntreprise;
    private String matriculeFiscale;
    private String statutEntreprise; 
    private String professionDetail;
    private String secteurActivite;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateEmbauche;

    private String typeContrat; 
    private Integer dureeContratMois; 
    private Integer periodeEssaiMois;
    private Integer moisTravailles;
    private Integer moisRestants;

    private Double montant;
    private Integer duree; 
    private String objetCredit;
    private Double revenuMensuel;
    private Double autresCredits;
    private Double chargesFixes;
    private String descriptionCharges;
    private String garantie;
    private Double dtiRatio;
    private Double scoreIA;

    @Column(name = "Lien_Justificatif", length = 1000)
    private String justificatifUrl; 
    
    private String statut = "EN_ATTENTE";
}