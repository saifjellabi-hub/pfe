import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  // الرابط اللي يوصل للـ Controller متاع الـ Java
 private apiUrl = 'http://localhost:8080/api/clients';

  constructor(private http: HttpClient) { }

  // ميثود تبعث بيانات الـ Client للـ Backend 
 register(clientData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, clientData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
  
  loginAdmin(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, credentials);
  }
  getClients(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/all`); 
}
}
