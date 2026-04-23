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
    if (this.creditForm.invalid) return;

    const formVal = this.creditForm.value;



    
    // 1. Calcul de l'âge
    const birthDate = new Date(formVal.dateNaissance!);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    // 2. Préparation de l'objet DemandeCredit (format Java)
    const demandeData = {
        ...formVal,
        age: age,
        ncin: JSON.parse(localStorage.getItem('currentUser') || '{}').ncin || '12345678', // Récupère le CIN de l'utilisateur connecté
        statut: 'EN_ATTENTE'
    };

    // 3. Utilisation de FormData pour envoyer Fichiers + JSON
    const dataToSend = { ...this.creditForm.value };
    delete (dataToSend as any).files;
    delete (dataToSend as any).piecesJustificatives;

    const formData = new FormData();

    formData.append('demande', JSON.stringify(this.creditForm.value));
    
    this.selectedFilesActual.forEach(file => {
        formData.append('files', file);
    });

    // 4. Envoi au Service
    this.creditService.createDemande(formData).subscribe({
        next: (res) => {
            alert('Demande envoyée avec succès !');
            this.router.navigate(['/client-dashboard']);
        },
        error: (err) => {
            console.error('Erreur lors de l\'envoi', err);
            alert('Erreur lors de l\'envoi de la demande.');
        }
    });
}

mapSituation(val: string) {
  if (val === 'celibataire') return 0;
  if (val === 'marie') return 1;
  return 2; // divorce
}

mapContrat(val: string) {
  if (val === 'Titulaire') return 0;
  if (val === 'CDI') return 1;
  if (val === 'CDD') return 2;
  return 3; // CVP
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