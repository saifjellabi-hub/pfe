package com.vermeg.backend.controllers;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class ChatController {

    private final Map<String, String> knowledgeBase = new LinkedHashMap<>();

    public ChatController() {
        // --- 1. التحيات (Salutations) ---
        knowledgeBase.put("bonjour|salut|عسلامة|hey", "Bonjour ! Je suis l'assistant CreditAI. Je peux vous informer sur les conditions, documents, garanties et l'analyse de risque.");
        knowledgeBase.put("bonsoir", "Bonsoir ! En quoi puis-je vous aider pour votre projet d'analyse de crédit ?");

        // --- 2. شروط القرض (Conditions & Éligibilité) ---
        knowledgeBase.put("condition|éligibilité|شروط|عمر|age", 
            "Les conditions incluent : Âge (18-65 ans), un revenu stable (salarié, fonctionnaire, retraité), et une capacité de remboursement où la mensualité ne dépasse pas 30-40% du revenu.");
        knowledgeBase.put("salaire|revenu|دخل", "Le salaire doit être stable et couvrir les mensualités. Un historique bancaire propre (sans chèques sans provision) est obligatoire.");

        // --- 3. الوثائق المطلوبة (Documents) ---
        knowledgeBase.put("document|papier|وثائق|ورق|fiche", 
            "Documents requis : CIN, attestation de travail/contrat, relevés bancaires (3-6 mois), fiche de paie, et un contrat d'achat (pour voiture ou maison).");

        // --- 4. أنواع القروض (Types de Crédits) ---
        knowledgeBase.put("type|immobilier|auto|études|consommation|قرض|أنواع", 
            "Nous proposons : Crédit immobilier (logement), crédit auto (voiture), crédit études, crédit à la consommation, et crédit professionnel.");

        // --- 5. نسبة الفائدة والمدة (Taux & Durée) ---
        knowledgeBase.put("taux|intérêt|فائدة|نسبة", "Le taux (fixe ou variable) dépend du marché, de la durée, du montant et du risque client (Scoring).");
        knowledgeBase.put("durée|مدة|وقت", "La durée varie selon le type : Court terme (1-5 ans), Moyen terme (5-10 ans), et Long terme (jusqu'à 25 ans pour l'immobilier).");

        // --- 6. الضمانات (Garanties) ---
        knowledgeBase.put("garantie|hypothèque|caution|ضمان|رهن", 
            "Garanties acceptées : Hypothèque immobilière, gage sur véhicule, caution personnelle (كفيل), ou assurance vie.");

        // --- 7. الـ Machine Learning (Decision Tree - صلب مشروعك) ---
        knowledgeBase.put("score|scoring", "Le score est calculé par notre algorithme de Machine Learning. Il évalue la probabilité de défaut de paiement pour chaque client.");
        knowledgeBase.put("decision|algorithme|tree|شجرة", "Nous utilisons un modèle 'Decision Tree' pour classer les dossiers en 'Low Risk' (Accepté) ou 'High Risk' (Refusé).");

        // --- 8. القبول، الرفض وعدم السداد (Acceptation & Défaut) ---
        knowledgeBase.put("accepté|قبول", "Un crédit est accepté si le score IA est favorable et si le taux d'endettement est respecté.");
        knowledgeBase.put("refusé|رفض", "Le refus peut être dû à un revenu insuffisant, un mauvais historique bancaire, ou une détection de haut risque par notre modèle.");
        knowledgeBase.put("retard|non-paiement|عدم السداد|مشكلة", "En cas de défaut : pénalités de retard, inscription sur la liste noire, saisie des garanties, ou poursuites judiciaires.");

        
        knowledgeBase.put("droit|contrat|حقوق", "Le client a le droit de connaître le taux effectif global (TEG), le montant total à rembourser, et le droit au remboursement anticipé.");

        knowledgeBase.put("montant|exact|حساب|فلوس", "Pour obtenir un tableau d'amortissement précis ou un montant exact, veuillez contacter directement votre conseiller Bank car je n'ai pas accès à vos données privées.");
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> payload) {
        String userText = payload.get("text").toLowerCase();
        String response = knowledgeBase.entrySet().stream()
                .filter(entry -> Arrays.stream(entry.getKey().split("\\|")).anyMatch(userText::contains))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse("Désolé, cette question est très précise. Je vous suggère de contacter directement votre banque ou de consulter un conseiller en agence pour obtenir une réponse exacte, car je n'ai pas les autorisations nécessaires pour ce détail.");

        return Map.of("reply", response);
    }
}