import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../services/agent.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-dashboard.html',
  styleUrl: './agent-dashboard.css'
})
export class AgentDashboardComponent implements OnInit {
  // 1. Injections
  private http = inject(HttpClient);
  private agentService = inject(AgentService);
  private router = inject(Router);

  // 2. Propriétés (Déclarées UNE SEULE FOIS ici)
  agentName: string = '';
  demandes: any[] = [];
  
  clients: any[] = [];
  filteredClients: any[] = [];
  searchTermClient: string = '';

  showHistoryModal = false;
  selectedClientHistory: any[] = [];
  currentClientName = '';

  // 3. Initialisation (Une seule méthode ngOnInit)
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.agentName = user.nom ? `${user.nom} ${user.prenom}` : 'Agent';
    
    this.chargerDemandes();
    this.loadClients();
  }

  // 4. Méthodes pour les Demandes
  chargerDemandes(): void {
    this.agentService.getDemandes().subscribe({
      next: (data: any[]) => {
        this.demandes = data;
      },
      error: (err: any) => console.error("Erreur de chargement des demandes", err)
    });
  }

  valider(id: number): void {
    this.agentService.modifierStatut(id, 'ACCEPTE').subscribe({
      next: () => {
        alert('Crédit Approuvé !');
        this.chargerDemandes(); 
      },
      error: (err) => alert("Erreur lors de la validation")
    });
  }

  rejeter(id: number): void {
    this.agentService.modifierStatut(id, 'REFUSE').subscribe({
      next: () => {
        alert('Crédit Refusé');
        this.chargerDemandes();
      },
      error: (err) => alert("Erreur lors du refus")
    });
  }

  getCountByStatut(statut: string): number {
    return this.demandes.filter(d => d.statut === statut).length;
  }

  // 5. Méthodes pour les Clients
  loadClients() {
  this.http.get<any[]>('http://localhost:8080/api/clients/all').subscribe({
    next: (data) => {
      console.log("Données reçues :", data);
      this.clients = data;
      this.filteredClients = [...data]; // On crée une nouvelle référence de tableau
    },
    error: (err) => console.error("Erreur :", err)
  });
}

  filterClients(): void {
    this.filteredClients = this.clients.filter(client =>
      client.ncin.toString().includes(this.searchTermClient) ||
      (client.nom + ' ' + client.prenom).toLowerCase().includes(this.searchTermClient.toLowerCase())
    );
  }

  // 6. Historique et Modal
  voirDetailsClient(client: any): void {
    this.currentClientName = client.nom + ' ' + client.prenom;
    this.http.get<any[]>(`http://localhost:8080/api/credits/client/${this.currentClientName}`)
      .subscribe({
        next: (data) => {
          this.selectedClientHistory = data;
          this.showHistoryModal = true;
        },
        error: (err) => console.error("Erreur historique", err)
      });
  }

  closeModal(): void {
    this.showHistoryModal = false;
  }

  // 7. Navigation
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/agent-login']);
  }
}