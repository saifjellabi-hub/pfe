import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# 1. Charger les données
data = pd.read_csv('dataset_credit.csv')

# 2. Séparer les Entrées (X) et la Sortie à prédire (y)
# On donne tout sauf la colonne 'Decision'
X = data.drop('Decision', axis=1) 
# On veut prédire la 'Decision'
y = data['Decision'] 

# 3. Diviser en données d'entraînement et de test
# On garde 20% des données pour tester si l'IA a bien appris
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 4. Choisir l'algorithme (Le "Cerveau")
# Random Forest est excellent pour le crédit scoring
model = RandomForestClassifier()

# 5. L'ENTRAÎNEMENT (Le moment où l'IA apprend)
model.fit(X_train, y_train)

# 6. Sauvegarder le modèle pour l'utiliser plus tard
joblib.dump(model, 'modele_credit.pkl')

print("Félicitations ! Ton IA est entraînée et sauvegardée dans 'modele_credit.pkl'")