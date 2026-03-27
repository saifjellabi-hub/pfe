package com.vermeg.backend.entities;

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

    private Double montant;
    private Integer duree; // بالأشهر (اللي حولناها في الـ Angular)
    private Double revenuMensuel;
    private Double autresCredits;
    private Double pensionAlimentaire;
    private String typeEmploi; // CDI, CDD, CVP, Freelance
    private String professionDetail;
    private Integer anciennete;
    private String secteurActivite;
    private Integer age;
    private String situationFamiliale;
    private Integer nbEnfants;
    private String agesEnfants; // تُخزن كـ String (مثلاً "5,10")

    private Double dtiRatio;
    private String decisionIA; // Accepté / Refusé
    private Double scoreIA;   // النسبة اللي رجعها الـ AI
    private String status;    // "En attente"
}