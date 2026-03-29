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
    secteurActivite: new FormControl('public', [Validators.required]),

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
  // زيد السطر هذا في أول الـ onSubmit
this.creditForm.patchValue({
  justificatifUrl: this.selectedFilesList.join(', ')
});
  if (this.creditForm.valid) {
    const data = this.creditForm.getRawValue();
    
    // 1. حساب المدة بالأشهر والـ DTI
    const dureeEnMois = Number(data.duree) * 12; //
    const mensualite = (Number(data.montant) / dureeEnMois);
    const totalCharges = mensualite + Number(data.autresCredits) + Number(data.pensionAlimentaire);
    const dti = (totalCharges / Number(data.revenuMensuel)) * 100;

    // 2. تحويل agesEnfants من Array إلى String (باش الـ Java ما يرفضش الطلب)
    // مثال: [5, 10] تولي "5,10"
    const agesEnfantsString = data.agesEnfants ? data.agesEnfants.join(',') : '';

    const finalPayload = {
      ...data,
      agesEnfants: agesEnfantsString, // النص المحول
      duree: dureeEnMois, 
      dtiRatio: dti,
      status: 'En attente'
    };

    console.log('Envoi du payload:', finalPayload); // ثبت في الـ Console لكان الـ agesEnfants ولات String

    this.creditService.createDemande(finalPayload).subscribe({
      next: (response) => {
        console.log('Demande envoyée avec succès. Analyse IA en cours...', response);
        this.creditService.setDemandeData(response);
        this.router.navigate(['/resultat-credit']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'envoi de la demande de crédit :', err);
      }
    });
  } else {
    // لو الفورم Invalide، نطبعو شكوني الخانة اللي معطلتنا
    console.warn('Le formulaire est invalide. Vérification des erreurs :');
    Object.keys(this.creditForm.controls).forEach(key => {
      const controlErrors = this.creditForm.get(key)?.errors;
      if (controlErrors != null) {
        console.log('Champ avec erreur: ' + key, controlErrors);
      }
    });
  }
}
async onFileSelected(event: any) {
  const files = event.target.files;
  if (files && files.length > 0) {
    const filesArray = Array.from(files);

    // 1. نستناو التصاور الكل يتقراو قبل ما نتعداو
    for (const file of filesArray) {
      if (!this.selectedFilesList.includes((file as File).name)) {
        this.selectedFilesList.push((file as File).name);
        
        // قراءة التصويرة وتحويلها لـ Base64
        const base64 = await this.readFileAsDataURL(file as File);
        this.selectedFilePreviews.push(base64);
      }
    }

    // 2. تحديث الـ UI مرة وحدة بعد ما كل شيء حضر
    this.selectedFilePreviews = [...this.selectedFilePreviews];
    this.creditForm.patchValue({
      justificatifUrl: this.selectedFilesList.join(', ')
    });

    // تصفير الـ Input
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

  this.creditForm.patchValue({
    justificatifUrl: this.selectedFilesList.join(', ')
  });

  const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
  if (fileInput) fileInput.value = ''; 
}
}