package com.vermeg.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DemandeCredit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "montantCredit")
    private Double montant;
    @Column(name = "DuréeRemboursement")
    private Integer duree; // بالأشهر (اللي حولناها في الـ Angular)
    private String objetCredit;
    private Double revenuMensuel;
    @Column(name = "mensualitésCréditsActuels")
    private Double autresCredits;
    private String garantie;
    private Double pensionAlimentaire;
    @Column(name = "montantContrat")
    private String typeEmploi; // CDI, CDD, CVP, Freelance
    @Column(name = "poste")
    private String professionDetail;
    private Integer anciennete;
    private String secteurActivite;
    private Integer age;
    private String situationFamiliale;
    private Integer nbEnfants;
    private String agesEnfants; // تُخزن كـ String (مثلاً "5,10")
    @Column(name = "Lien_Justificatif")
private String justificatifUrl; // يخزن مسار الملف في الـ Server

    private Double dtiRatio;
    private String decisionIA; // Accepté / Refusé
    private Double scoreIA;   // النسبة اللي رجعها الـ AI
    private String status;    // "En attente"
}