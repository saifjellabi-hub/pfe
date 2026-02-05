import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule ,FormGroup, FormControl, Validators} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-demande-credit',
  standalone: true,
  imports:[CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './demande-credit.html',
  styleUrls: ['./demande-credit.css']
})
export class DemandeCredit {

  creditForm = new FormGroup({
    montant: new FormControl('', [Validators.required, Validators.min(1000)]),
    duree: new FormControl('', [Validators.required, Validators.min(6), Validators.max(360)]), // en mois
    revenuMensuel: new FormControl('', [Validators.required, Validators.min(0)]),
    profession: new FormControl('', [Validators.required]),
    objetCredit: new FormControl('immobilier', [Validators.required])
  });

  onSubmit() {
    if (this.creditForm.valid) {
      console.log("Données envoyées :", this.creditForm.value);
      //bch mbaed tekhdem beha el springboot
      alert("Demande envoyée pour analyse !");
    } else {
      alert("Veuillez remplir correctement le formulaire.");
    }
  }
}