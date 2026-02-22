import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../services/agent.service'; 
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css'] 
})
export class AdminLayoutComponent implements OnInit {
  isDarkMode = true; 
  agents: any[] = [];
clients: any[] = [];

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
        this.agents = [...data]; // نمرر نسخة من البيانات
        this.cdr.detectChanges(); // 3. نجبر الـ Angular باش يعرضهم توا
      },
      error: (err) => console.error('Erreur Agents:', err)
    });

    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = [...data]; // نمرر نسخة من البيانات
        this.cdr.detectChanges(); // 4. نجبر الـ Angular باش يعرضهم توا
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
}
