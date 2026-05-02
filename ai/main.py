from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Optional, Any
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

app = FastAPI()

# Modèle synchronisé avec ton entité Java DemandeCredit
class CreditRequest(BaseModel):
    genre: Optional[str] = "Homme"
    age: Optional[int] = 0
    situationFamiliale: Optional[str] = "Célibataire"
    nbEnfants: Optional[int] = 0
    typeContrat: Optional[str] = "CDI"
    montant: float
    duree: int
    revenuMensuel: float
    chargesFixes: float
    typeGarantie: Optional[str] = "Aucune"
    valeurGarantie: Optional[float] = 0.0

    class Config:
        populate_by_name = True

@app.post("/predict")
def predict_credit(req: CreditRequest):
    # --- LOGIQUE DE CONVERSION ---
    # On convertit les textes en nombres pour le calcul
    genre_num = 1 if req.genre and req.genre.lower() == "homme" else 2
    contrat_num = 2 if req.typeContrat and req.typeContrat.lower() == "cdd" else 1

    # --- CALCUL DU SCORE ---
    # 1. Reste à vivre
    reste_a_vivre = req.revenuMensuel - req.chargesFixes
    score_base = (reste_a_vivre / req.revenuMensuel) * 100 if req.revenuMensuel > 0 else 0
    
    # 2. Impact de la Garantie
    ratio_couverture = (req.valeurGarantie / req.montant) if req.montant > 0 else 0
    
    bonus_garantie = 0
    type_g = req.typeGarantie.lower() if req.typeGarantie else ""
    if "hypothèque" in type_g:
        bonus_garantie = ratio_couverture * 15
    elif "nantie" in type_g:
        bonus_garantie = ratio_couverture * 20
    elif "gage" in type_g:
        bonus_garantie = ratio_couverture * 10
    
    score_final = score_base + bonus_garantie
    
    # 3. Pénalité Contrat
    if contrat_num == 2:
        score_final -= 20 

    # --- DÉCISION FINALE ---
    decision = "Favorable" if score_final >= 50 else "Défavorable"
    if score_final < 50 and ratio_couverture > 1.2:
        decision = "À étudier (Garantie solide)"

    return {
        "score": round(min(max(score_final, 0), 100), 2),
        "ratio_couverture": round(ratio_couverture, 2),
        "decision": decision
    }