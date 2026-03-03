import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../services/agent.service'; 
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css'] 
})
export class AdminLayoutComponent implements OnInit {
  isDarkMode = true; 
  agents: any[] = [];
clients: any[] = [];
editingClientNcin: number | null = null;
editFormData: any = {};
editingAgentId: number | null = null;
editAgentData: any = {};
searchTermClient: string = '';
searchTermAgent: string = '';

  constructor(
    private agentService: AgentService, 
    private clientService: ClientService,
    private router: Router,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
  this.loadData();
}

loadData() {
    this.agentService.getAgents().subscribe({
      next: (data) => {
        this.agents = [...data]; 
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Erreur Agents:', err)
    });

    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = [...data]; 
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Erreur Clients:', err)
    });
  }
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;

    
    const host = document.querySelector('app-admin-layout') as HTMLElement;
    if (this.isDarkMode) {
      host.classList.remove('light-theme');
    } else {
      host.classList.add('light-theme');
    }
  }

  
  goToAddAgent() {
    this.router.navigate(['/ajouter-agent']); 
  }

  // logout
  logout() {
    this.router.navigate(['/admin-login']);
  }
  

deleteAgent(id: number) {
  if (confirm('Voulez-vous vraiment supprimer cet agent ?')) {
    this.agentService.deleteAgent(id).subscribe({
      next: () => {
        alert('Agent supprimé !');
        this.loadData(); 
      },
      error: (err) => console.error(err)
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
        alert('Données client mises à jour avec succès !');
        this.editingClientNcin = null; 
        this.loadData(); 
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la mise à jour');
      }
    });
  }
}
startEditAgent(agent: any) {
  this.editingAgentId = agent.id;
  this.editAgentData = { ...agent }; // نسخة من معطيات الوكيل
}
cancelAgentEdit() {
  this.editingAgentId = null;
  this.editAgentData = {};
}
saveAgentEdit() {
  if (this.editingAgentId) {
    this.agentService.updateAgent(this.editingAgentId, this.editAgentData).subscribe({
      next: (res) => {
        // هذا السطر هو اللي يحي الـ Inputs ويرجع الجدول عادي بمجرد نجاح العملية
        this.editingAgentId = null; 
        
        alert('Agent mis à jour avec succès !');
        
        this.loadData(); // إعادة شحن البيانات الجديدة من السيرفر
      },
      error: (err) => {
        console.error("Erreur update agent:", err);
        alert('Erreur lors de la mise  jour');
      }
    });
  }
}
// ميثود الفلترة للـ Clients (حسب الـ CIN)
get filteredClients() {
  return this.clients.filter(client => 
    client.ncin.toString().includes(this.searchTermClient)
  );
}

// ميثود الفلترة للـ Agents (حسب الـ Matricule)
get filteredAgents() {
  return this.agents.filter(agent => 
    agent.matricule.toLowerCase().includes(this.searchTermAgent.toLowerCase())
  );
}
}
