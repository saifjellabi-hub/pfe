import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../services/agent.service';
import { ClientService } from '../services/client.service';
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
  isDarkMode = true;
  private http = inject(HttpClient);

  // Propriétés pour la gestion des données
  agentName: string = '';
  demandes: any[] = [];
  clients: any[] = [];
  
  // Propriétés pour la recherche
  searchTermCredit: string = '';
  searchTermClient: string = '';

  // --- NOUVEAU : Propriétés pour l'édition (Identique à l'Admin) ---
  editingClientNcin: number | null = null;
  editFormData: any = {};

  showHistoryModal = false;
  selectedClientHistory: any[] = [];
  currentClientName = '';

  constructor(
    private agentService: AgentService, 
    private clientService: ClientService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    
    // On cible le sélecteur de ce composant
    const host = document.querySelector('app-agent-dashboard') as HTMLElement;
    
    if (this.isDarkMode) {
      host.classList.remove('light-theme');
    } else {
      host.classList.add('light-theme');
    }
  }


  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.agentName = user.nom ? `${user.nom} ${user.prenom}` : 'Agent';
    this.loadData();
  }

  loadData(): void {
    console.log("Chargement des données pour l'agent...");
    
    // 1. Charger les Clients
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur clients", err)
    });

    // 2. Charger les Demandes de crédit (Endpoint que nous avons créé en Java)
    this.agentService.getDemandes().subscribe({
      next: (data) => {
        this.demandes = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur demandes", err)
    });
  }

  // --- SECTION CLIENTS (Logique copiée de l'Admin) ---

  startEditClient(client: any) {
    this.editingClientNcin = client.ncin;
    this.editFormData = { ...client }; 
  }

  cancelEdit() {
    this.editingClientNcin = null;
    this.editFormData = {};
  }

  saveEdit() {
    if (this.editingClientNcin) {
      this.clientService.updateClient(this.editingClientNcin, this.editFormData).subscribe({
        next: () => {
          alert('Données client mises à jour !');
          this.editingClientNcin = null; 
          this.loadData(); 
        },
        error: (err) => alert('Erreur lors de la mise à jour')
      });
    }
  }

  deleteClient(ncin: number) {
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.clientService.deleteClient(ncin).subscribe({
        next: () => {
          alert('Client supprimé !');
          this.loadData(); 
        },
        error: (err) => console.error(err)
      });
    }
  }

  // --- GETTERS POUR LE FILTRAGE ---

  get filteredClients() {
    return this.clients.filter(client => 
      client.ncin?.toString().includes(this.searchTermClient)
    );
  }

  get filteredDemandes() {
    const term = this.searchTermCredit.toLowerCase();
    return this.demandes.filter(d => 
      d.ncin?.toString().includes(term) || 
      (d.nom + ' ' + d.prenom).toLowerCase().includes(term)
    );
  }

  // --- NAVIGATION & AUTRES ---

  goToRegister(): void {
    this.router.navigate(['/inscription']);
  }
  goTosimulation(): void {
    this.router.navigate(['/simulation-credit']);
  }
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/agent-login']);
  }

  deleteDemande(id: number): void {
    if(confirm("Supprimer cette demande ?")) {
      // Ajoute une méthode deleteDemande dans ton agentService si besoin
      console.log("Suppression demande", id);
    }
  }

  // Pour le bouton "Oeil" (Détails)
  viewDetails(id: number): void {
     // Logique pour voir les détails d'une demande
  }

}