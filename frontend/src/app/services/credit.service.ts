import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  // هوني نخزنو البيانات باش نجمو نقراوهم في صفحة الـ Resultat
  private demandeData: any;

  constructor() { }

  // هذه الـ Method اللي كانت ناقصة عندك
  setDemandeData(data: any) {
    this.demandeData = data;
    console.log('Data saved in service:', this.demandeData);
  }

  // الـ Method هذه تستحقها في صفحة الـ Resultat باش تجبد الـ Data
  getDemandeData() {
    return this.demandeData;
  }
}