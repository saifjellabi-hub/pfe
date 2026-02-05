import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule ,FormGroup, FormControl, Validators} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CreditService } from '../services/credit';
import { Router } from '@angular/router';

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


  constructor(
    private creditService: CreditService, 
    private router: Router) {};



  onSubmit() {
  const formValues = this.creditForm.getRawValue();
  if (this.creditForm.valid) {
    const mnt = Number(formValues.montant);
    const rev = Number(formValues.revenuMensuel);
    
    const scoreCalcule = this.creditService.calculerScore(mnt, rev);
    console.log('Score calculé avant redirection :', scoreCalcule);
    
    this.router.navigate(['/resultat-credit']);
  }
}
}