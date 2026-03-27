from flask import Flask, request, jsonify
import joblib # أو pickle حسب الموديل متاعك
import numpy as np

app = Flask(__name__)

# هوني تحط الموديل اللي دربته (Decision Tree مثلا)
# model = joblib.load('credit_model.pkl') 

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    # 1. نستخرجو البيانات اللي بعثها الـ Java
    # لازم يكونوا بنفس الترتيب اللي تدرب عليه الموديل
    montant = data.get('montant')
    revenu = data.get('revenuMensuel')
    dti = data.get('dtiRatio')
    age = data.get('age')
    
    # 2. تجربة بسيطة (Logic) لين تربط الموديل متاعك
    # هوني تحط: prediction = model.predict([[...]])
    
    # مثال كقاعدة ذكية مؤقتة:
    if dti < 40 and age < 60:
        decision = "Accepté"
        score = 85.5  # الـ Score متاع الـ AI
    else:
        decision = "Refusé"
        score = 20.0

    return jsonify({
        "decision": decision,
        "score": score
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)