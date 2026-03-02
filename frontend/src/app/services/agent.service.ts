import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = 'http://localhost:8080/api/agents';

  constructor(private http: HttpClient) {}

  registerAgent(agentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, agentData);
  }

  loginAgent(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
  getAgents(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/all`); 
}

deleteAgent(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/delete/${id}`);
}

updateAgent(id: number, agent: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/update/${id}`, agent);
}

login(credentials: any): Observable<any> {
  return this.http.post('http://localhost:8080/api/agents/login', credentials);
}
}