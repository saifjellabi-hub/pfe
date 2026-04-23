from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# On charge le nouveau modèle qu'on va entraîner
# model = joblib.load('modele_complet.pkl') 

class CreditRequest(BaseModel):
    genre: int
    age: int
    situation_familiale: int
    nb_enfants: int
    type_contrat: int
    montant: float
    duree: int
    revenu: float
    charges: float

@app.post("/predict")
def predict_credit(req: CreditRequest):
    # L'IA calcule le "Reste à vivre" automatiquement
    reste_a_vivre = req.revenu - req.charges
    
    input_data = pd.DataFrame([[
        req.genre, req.age, req.situation_familiale, req.nb_enfants, 
        req.type_contrat, req.montant, req.duree, req.revenu, req.charges
    ]], columns=['Genre', 'Age', 'Situation_Familiale', 'Nb_Enfants', 'Type_Contrat', 'Montant', 'Duree', 'Revenu', 'Charges'])
    
    # Simulation du score (en attendant le nouvel entraînement)
    # Dans ton cas, utilise model.predict_proba...
    score = (reste_a_vivre / req.revenu) * 100
    if req.type_contrat == 2: score -= 20 # Pénalité si CDD
    
    return {"score": round(min(max(score, 0), 100), 2)}