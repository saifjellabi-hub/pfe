package com.vermeg.backend.entities;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
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

    // --- ÉTAPE 1 : PROFIL PERSONNEL ---
    private String nom;
    private String prenom;
    private String genre; // Homme / Femme
    private LocalDate dateNaissance;
    private Integer age;
    private String situationFamiliale;
    private Double pensionAlimentaire;
    private Integer nbEnfants;
    @Column(columnDefinition = "TEXT")
    private String datesNaissanceEnfants; // Format: "2015-05-12,2018-03-20"

    // --- ÉTAPE 2 : ENTREPRISE & CONTRAT ---
    private String nomEntreprise;
    private String matriculeFiscale;
    private String statutEntreprise; // Privé / Étatique
    private String professionDetail;
    private String secteurActivite;
    private LocalDate dateEmbauche;
    private String typeContrat; // CDI, CDD, CVP1, CVP2
    private Integer dureeContratMois; 
    private Integer periodeEssaiMois;
    private Integer moisTravailles;
    private Integer moisRestants;

    // --- ÉTAPE 3 : CRÉDIT & FINANCE ---
    private Double montant;
    private Integer duree; 
    private String objetCredit;
    private Double revenuMensuel;
    private Double autresCredits;
    private Double chargesFixes;
    private String descriptionCharges;
    private String garantie;
    private Double dtiRatio;
    
    @Column(name = "Lien_Justificatif")
    private String justificatifUrl; 
    private String statut = "EN_ATTENTE";
}