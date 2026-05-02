package com.vermeg.backend.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

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
    @JsonProperty("situationFamiliale")
    private String situationFamiliale;
    private Double pensionAlimentaire;
    @JsonProperty("nbEnfants")
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

    @JsonProperty("typeContrat")
    private String typeContrat;
    private Integer dureeContratMois; 
    private Integer periodeEssaiMois;
    private Integer moisTravailles;
    private Integer moisRestants;

    private Double montant;
    private Integer duree; 
    private String objetCredit;
    @JsonProperty("revenuMensuel")
    private Double revenuMensuel;
    private Double autresCredits;
    @JsonProperty("chargesFixes")
    private Double chargesFixes;
    private String descriptionCharges;
    private Double dtiRatio;
    private Double scoreIA;

    
    @Column(length = 1000)
    private String urlCin;
    @Column(length = 1000)
    private String urlAttestation;
    @Column(length = 1000)
    private String urlFichesPaie;
    
    private String statut = "EN_ATTENTE";

    private String typeGarantie;
    private Double valeurGarantie;
    // Getters et Setters
    public String getTypeGarantie() { return typeGarantie; }
    public void setTypeGarantie(String typeGarantie) { this.typeGarantie = typeGarantie; }

    public Double getValeurGarantie() { return valeurGarantie; }
    public void setValeurGarantie(Double valeurGarantie) { this.valeurGarantie = valeurGarantie; }
}
