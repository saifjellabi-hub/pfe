import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
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
  selectedFilesActual: File[] = [];
  selectedFilesList: string[] = [];

  creditForm = new FormGroup({
    // --- STEP 1: PROFIL ---
    nom: new FormControl('', Validators.required),
    prenom: new FormControl('', Validators.required),
    genre: new FormControl('Homme', Validators.required),
    dateNaissance: new FormControl('', Validators.required),
    situationFamiliale: new FormControl('celibataire', Validators.required),
    pensionAlimentaire: new FormControl(0),
    nbEnfants: new FormControl(0),
    datesNaissanceEnfants: new FormArray([]),

    // --- STEP 2: ENTREPRISE ---
    nomEntreprise: new FormControl('', Validators.required),
    matriculeFiscale: new FormControl('', Validators.required),
    statutEntreprise: new FormControl('Privé', Validators.required),
    professionDetail: new FormControl('', Validators.required),
    secteurActivite: new FormControl('Technologie / IT', Validators.required),
    dateEmbauche: new FormControl('', Validators.required),
    typeContrat: new FormControl('CDI', Validators.required),
    dureeContratMois: new FormControl(''),
    periodeEssaiMois: new FormControl(''),
    moisTravailles: new FormControl(''),
    moisRestants: new FormControl(''),

    // --- STEP 3: CRÉDIT ---
    montant: new FormControl('', [Validators.required, Validators.min(1000)]),
    duree: new FormControl('', [Validators.required, Validators.min(1)]),
    revenuMensuel: new FormControl('', [Validators.required, Validators.min(500)]),
    autresCredits: new FormControl(0),
    chargesFixes: new FormControl(0),
    descriptionCharges: new FormControl(''),
    objetCredit: new FormControl('immobilier', Validators.required),
    garantie: new FormControl('Cession sur salaire', Validators.required),
    justificatifUrl: new FormControl('')
  });

  constructor(private creditService: CreditService, private router: Router) {}

  get datesNaissanceEnfants() {
    return this.creditForm.get('datesNaissanceEnfants') as FormArray;
  }

  onNbEnfantsChange() {
    const nb = this.creditForm.get('nbEnfants')?.value || 0;
    while (this.datesNaissanceEnfants.length < nb) {
      this.datesNaissanceEnfants.push(new FormControl('', Validators.required));
    }
    while (this.datesNaissanceEnfants.length > nb) {
      this.datesNaissanceEnfants.removeAt(this.datesNaissanceEnfants.length - 1);
    }
  }

  nextStep() { this.currentStep++; }
  prevStep() { this.currentStep--; }

  onSubmit() {
    const userData = localStorage.getItem('currentUser');
    if (!userData || this.creditForm.invalid) return;
    
    const currentUserNcin = JSON.parse(userData).ncin;
    const data = this.creditForm.getRawValue();

    // --- LOGIQUE FINANCIÈRE (PENSION) ---
    let revenuAjuste = Number(data.revenuMensuel);
    if (data.situationFamiliale === 'divorce') {
      if (data.genre === 'Homme') {
        revenuAjuste -= Number(data.pensionAlimentaire); // On retire
      } else {
        revenuAjuste += Number(data.pensionAlimentaire); // On ajoute
      }
    }

    const mensualite = (Number(data.montant) / (Number(data.duree) * 12));
    const dti = ((mensualite + Number(data.autresCredits) + Number(data.chargesFixes)) / revenuAjuste) * 100;

    const finalPayload = {
      ...data,
      ncin: currentUserNcin,
      dtiRatio: dti,
      datesNaissanceEnfants: data.datesNaissanceEnfants.join(','),
      statut: 'EN_ATTENTE'
    };

    const formData = new FormData();
    formData.append('demande', new Blob([JSON.stringify(finalPayload)], { type: 'application/json' }));
    this.selectedFilesActual.forEach(file => formData.append('files', file));

    this.creditService.createDemande(formData).subscribe({
      next: () => this.router.navigate(['/resultat-credit']),
      error: (err) => alert("Erreur: " + err.message)
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file: any) => {
        this.selectedFilesList.push(file.name);
        this.selectedFilesActual.push(file);
      });
    }
  }

  removeFile(i: number) {
    this.selectedFilesList.splice(i, 1);
    this.selectedFilesActual.splice(i, 1);
  }
}