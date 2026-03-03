import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Pour *ngIf et le pipe 'number'
import { FormsModule } from '@angular/forms';   // Pour [(ngModel)]

@Component({
  selector: 'app-simulation-credit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./simulation-credit.html',
  styleUrl: './simulation-credit.css',
})
export class SimulationCredit {
  salaire: number = 0;
  duree: number = 12;
  resultat: number = 0;
  montantCredit: number = 0;
  totalARembourser: number = 0;
  totalInteret: number = 0;
  tauxAnnuel: number = 0.08;

calculer() {
  if (this.salaire > 0 && this.duree > 0) {
    // 1. Mensualité maximale (40% du salaire)
    const mensualite = this.salaire * 0.4;
    
    // 2. Taux d'intérêt mensuel
    const i = this.tauxAnnuel / 12;
    
    // 3. Calcul du capital empruntable (Formule de l'annuité inversée)
    // Formule : P = M * [1 - (1+i)^-n] / i
    const puissance = Math.pow(1 + i, -this.duree);
    this.montantCredit = Math.round(mensualite * (1 - puissance) / i);
    
    // 4. Total à rembourser (Mensualité * Nombre de mois)
    this.totalARembourser = Math.round(mensualite * this.duree);
    
    // 5. Total des intérêts
    this.totalInteret = this.totalARembourser - this.montantCredit;
    
    // On garde 'resultat' pour la compatibilité avec ton HTML actuel
    this.resultat = this.montantCredit; 
  }
}
}
