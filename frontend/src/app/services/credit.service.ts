import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
    private apiUrl = 'http://localhost:8080/api/demandes';
  // هوني نخزنو البيانات باش نجمو نقراوهم في صفحة الـ Resultat
  private demandeData: any;

  constructor(private http: HttpClient) { }

  createDemande(data: any) {
    // تبعث الطلب للـ Spring Boot اللي هو بدورو باش يكلم الـ Flask
    return this.http.post(this.apiUrl, data);
  }

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