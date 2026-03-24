import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CreditService } from '../services/credit';

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
    duree: new FormControl('', [Validators.required, Validators.min(6), Validators.max(300)]),
    revenuMensuel: new FormControl('', [Validators.required, Validators.min(500)]),
    autresCredits: new FormControl(0, [Validators.min(0)]),
    tauxInteret: new FormControl(8.5, [Validators.required]), // نسبة الفائدة الافتراضية

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
    agesEnfants: new FormControl(''), // نص مثل: "5, 12"
    objetCredit: new FormControl('immobilier', [Validators.required])
  });

  constructor(private creditService: CreditService, private router: Router) {}

  nextStep() { if (this.currentStep < 3) this.currentStep++; }
  prevStep() { if (this.currentStep > 1) this.currentStep--; }

  onSubmit() {
    if (this.creditForm.valid) {
      const data = this.creditForm.getRawValue();
      // حساب الـ DTI (Debt-to-Income) لبعثه للـ AI
      const mensualite = (Number(data.montant) / Number(data.duree));
      const totalCharges = mensualite + Number(data.autresCredits) + Number(data.pensionAlimentaire);
      const dti = (totalCharges / Number(data.revenuMensuel)) * 100;

      
      this.router.navigate(['/resultat-credit']);
    }
  }
}