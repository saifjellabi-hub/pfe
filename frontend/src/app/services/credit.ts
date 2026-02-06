import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CreditService {
  private dernierScore: number = 0;

  calculerScore(montant: number, revenu: number): number {
    const ratio = (revenu * 0.4) / (montant / 12);
    this.dernierScore = Math.min(Math.round(ratio * 100), 100);
    return this.dernierScore;
  }

  getScore() {
    return this.dernierScore;
  }
}