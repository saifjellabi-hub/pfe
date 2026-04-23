import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  // Changement de 'demandes' vers 'credits' pour correspondre au Controller Java
  private apiUrl = 'http://localhost:8080/api/credits';

  constructor(private http: HttpClient) { }

  // 1. Envoi de la demande (JSON + Fichiers)
  createDemande(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }

  // 2. Récupérer les demandes d'un client spécifique
  getDemandesByClient(ncin: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/client/${ncin}`);
  }

  // 3. Récupérer une demande spécifique par ID
  getDemandeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}