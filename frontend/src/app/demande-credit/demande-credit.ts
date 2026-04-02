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
selectedFilesList: string[] = [];
selectedFilePreviews: any[] = [];
selectedFilesActual: File[] = [];
  creditForm = new FormGroup({
    // --- STEP 1: INFOS CRÉDIT & FINANCE ---
    montant: new FormControl('', [Validators.required, Validators.min(1000)]),
   duree: new FormControl('', [Validators.required, Validators.min(1), Validators.max(25)]),
    revenuMensuel: new FormControl('', [Validators.required, Validators.min(500)]),
    autresCredits: new FormControl(0, [Validators.min(0)]),
    garantie: new FormControl('Cession sur salaire', [Validators.required]),
    tauxInteret: new FormControl(8.5, [Validators.required]),

    // --- STEP 2: PROFIL PROFESSIONNEL ---
    typeEmploi: new FormControl('CDI', [Validators.required]),
    professionDetail: new FormControl('', [Validators.required]),
    anciennete: new FormControl('', [Validators.required, Validators.min(0)]),
    secteurActivite: new FormControl('Secteur Étatique', [Validators.required]),

    // --- STEP 3: SITUATION PERSONNELLE ---
    age: new FormControl('', [Validators.required, Validators.min(18), Validators.max(65)]),
    situationFamiliale: new FormControl('celibataire', [Validators.required]),
    pensionAlimentaire: new FormControl(0),
    nbEnfants: new FormControl(0, [Validators.min(0)]),
    agesEnfants: new FormArray([]), // بدلناها لـ FormArray باش تهز بزاف خانات
    objetCredit: new FormControl('immobilier', [Validators.required]),
    justificatifUrl: new FormControl('')
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
  const currentLen = this.agesEnfants.length;

  if (nb > currentLen) {
    for (let i = currentLen; i < nb; i++) {
      this.agesEnfants.push(new FormControl('', Validators.required));
    }
  } else {
    for (let i = currentLen; i > nb; i--) {
      this.agesEnfants.removeAt(i - 1);
    }
  }
}

  nextStep() { if (this.currentStep < 3) this.currentStep++; }
  prevStep() { if (this.currentStep > 1) this.currentStep--; }

onSubmit() {
  // 2. نجيبو الـ NCIN متاع الحريف اللي عامل Login
  const userData = localStorage.getItem('currentUser');
  if (!userData) {
    alert("Session expirée. Veuillez vous reconnecter.");
    this.router.navigate(['/login']);
    return;
  }
  const currentUserNcin = JSON.parse(userData).ncin;

  if (this.creditForm.valid) {
    const data = this.creditForm.getRawValue();
    
    // 3. الحسابات (المدة والـ DTI)
    const dureeEnMois = Number(data.duree) * 12;
    const mensualite = (Number(data.montant) / dureeEnMois);
    const totalCharges = mensualite + Number(data.autresCredits) + (Number(data.pensionAlimentaire) || 0);
    const dti = (totalCharges / Number(data.revenuMensuel)) * 100;
    const agesEnfantsString = data.agesEnfants ? data.agesEnfants.join(',') : '';

    // 5. الـ Payload النهائي (البيانات اللي ماشية للـ Database)
    const finalPayload = {
      ...data,
      ncin: currentUserNcin,  
      agesEnfants: agesEnfantsString,
      duree: dureeEnMois, 
      dtiRatio: dti,
      status: 'En attente'
    };
 const formData = new FormData();
 formData.append('demande', new Blob([JSON.stringify(finalPayload)], {
      type: 'application/json'
    }));

    // نزيدو ملفات الـ PDF الحقيقية
    this.selectedFilesActual.forEach((file) => {
      formData.append('files', file); 
    });

    // 6. بعث البيانات للـ Spring Boot
    this.creditService.createDemande(formData).subscribe({
      next: (response) => {
        console.log('Demande enregistrée avec succès !', response);
        this.router.navigate(['/resultat-credit']);
      },
      error: (err) => {
        console.error('Erreur Backend:', err);
       if (err.status === 400 || err.status === 500) {
      
      const errorMsg = typeof err.error === 'string' ? err.error : (err.error?.message || "Une demande existe déjà.");
      
      alert("⚠️ " + errorMsg); 
      
      
      this.router.navigate(['/resultat-credit']);
    } else {
      alert("Une erreur technique est survenue.");
    }
  }
    });
  } else {
    // لو الفورم ناقص، نخرجوا الأخطاء في الـ Console باش نعرفوا وين المشكلة
    console.warn('Le formulaire est invalide. Vérification des erreurs :');
    Object.keys(this.creditForm.controls).forEach(key => {
      const controlErrors = this.creditForm.get(key)?.errors;
      if (controlErrors != null) {
        console.log('Champ avec erreur: ' + key, controlErrors);
      }
    });
    alert("Veuillez remplir tous les champs obligatoires correctement.");
  }
}
async onFileSelected(event: any) {
  const files = event.target.files;
  if (files && files.length > 0) {
    const filesArray = Array.from(files) as File[];

    for (const file of filesArray) {
      if (file.type !== 'application/pdf') {
        alert(`Le fichier "${file.name}" n'est pas un PDF. Veuillez choisir uniquement des fichiers PDF.`);
        continue;
      }

      if (!this.selectedFilesList.includes(file.name)) {
        this.selectedFilesList.push(file.name);
        this.selectedFilesActual.push(file); 
        
        this.selectedFilePreviews.push('pdf-icon'); 
      }
    }
    this.selectedFilesList = [...this.selectedFilesList];
    this.creditForm.patchValue({
      justificatifUrl: this.selectedFilesList.join(', ')
    });

    event.target.value = ''; 
  }
}

// Function مساعدة تقرا الملف وتستناه لين يكمل (Promise)
readFileAsDataURL(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
removeFile(index: number) {
  this.selectedFilesList.splice(index, 1);
  this.selectedFilePreviews.splice(index, 1);
  
  // ⚠️ السطر هذا يخلي الـ Label يتصلح لحظياً
  this.selectedFilesList = [...this.selectedFilesList];
  this.selectedFilePreviews = [...this.selectedFilePreviews];
 this.selectedFilesActual.splice(index, 1);
  this.creditForm.patchValue({
    justificatifUrl: this.selectedFilesList.join(', ')
  });

  const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
  if (fileInput) fileInput.value = ''; 
}
}