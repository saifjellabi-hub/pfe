import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms'; // زدنا FormArray هوني
import { RouterModule, Router } from '@angular/router';
import { CreditService } from '../services/credit.service';

@Component({
  selector: 'app-demande-credit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './demande-credit.html',
  styleUrls: ['./demande-credit.css']
})
export class DemandeCredit {
  currentStep = 1;

  creditForm = new FormGroup({
    // --- STEP 1: INFOS CRÉDIT & FINANCE ---
    montant: new FormControl('', [Validators.required, Validators.min(1000)]),
   duree: new FormControl('', [Validators.required, Validators.min(1), Validators.max(25)]),
    revenuMensuel: new FormControl('', [Validators.required, Validators.min(500)]),
    autresCredits: new FormControl(0, [Validators.min(0)]),
    tauxInteret: new FormControl(8.5, [Validators.required]),

    // --- STEP 2: PROFIL PROFESSIONNEL ---
    typeEmploi: new FormControl('CDI', [Validators.required]),
    professionDetail: new FormControl('', [Validators.required]),
    anciennete: new FormControl('', [Validators.required, Validators.min(0)]),
    secteurActivite: new FormControl('public', [Validators.required]),

    // --- STEP 3: SITUATION PERSONNELLE ---
    age: new FormControl('', [Validators.required, Validators.min(18), Validators.max(65)]),
    situationFamiliale: new FormControl('celibataire', [Validators.required]),
    pensionAlimentaire: new FormControl(0),
    nbEnfants: new FormControl(0, [Validators.min(0)]),
    agesEnfants: new FormArray([]), // بدلناها لـ FormArray باش تهز بزاف خانات
    objetCredit: new FormControl('immobilier', [Validators.required])
  });

  constructor(private creditService: CreditService, private router: Router) {}

  // --- الهوني الخدمة الجديدة ---
  
  // Getter باش نوصلو لخانة الأعمار في الـ HTML بسهولة
  get agesEnfants() {
    return this.creditForm.get('agesEnfants') as FormArray;
  }

  // الـ Function اللي تزيد وتنقص الخانات حسب عدد الصغار
  onNbEnfantsChange() {
    const nb = this.creditForm.get('nbEnfants')?.value || 0;
    
    // نمسحو الخانات القديمة ونزيدو جدد حسب الرقم اللي تحط
    while (this.agesEnfants.length !== 0) {
      this.agesEnfants.removeAt(0);
    }

    for (let i = 0; i < nb; i++) {
      this.agesEnfants.push(new FormControl('', Validators.required));
    }
  }

  nextStep() { if (this.currentStep < 3) this.currentStep++; }
  prevStep() { if (this.currentStep > 1) this.currentStep--; }

 onSubmit() {
  if (this.creditForm.valid) {
    const data = this.creditForm.getRawValue();
    
    // تحويل السنين لأشهر في الحسبة: duree * 12
    const dureeEnMois = Number(data.duree) * 12;
    const mensualite = (Number(data.montant) / dureeEnMois);
    
    const totalCharges = mensualite + Number(data.autresCredits) + Number(data.pensionAlimentaire);
    const dti = (totalCharges / Number(data.revenuMensuel)) * 100;
    
    // نبعثو البيانات للـ Service مع المدة بالأشهر باش الـ AI يفهمها
    this.creditService.setDemandeData({ 
      ...data, 
      dureeMois: dureeEnMois, // بعثنا النسخة المحولة للأشهر
      dtiRatio: dti 
    });
    
    this.router.navigate(['/resultat-credit']);
  }
}
}