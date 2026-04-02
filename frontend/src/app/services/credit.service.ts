import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private apiUrl = 'http://localhost:8080/api/demandes';

  constructor(private http: HttpClient) { }

createDemande(formData: FormData): Observable<any> {
  // هوني نبعثو الـ formData كاملة (فيها الـ JSON والـ Files)
  return this.http.post(`${this.apiUrl}`, formData);
}

  // 2. تجيب كل الطلبات الخاصة بحريف معين من الـ Database باستعمال الـ NCIN
  // الـ Backend لازم يكون فيه Endpoint: /api/demandes/client/{ncin}
 getDemandesByClient(ncin: string): Observable<any> {
  return this.http.get(`http://localhost:8080/api/demandes/client/${ncin}`);
}

  // 3. دالة اختيارية إذا حبيت تجيب طلب واحد بالـ ID متاعو
  getDemandeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}