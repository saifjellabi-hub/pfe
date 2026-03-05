import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ThemeService } from '../theme';
import { AgentService } from '../services/agent.service'; 

@Component({
  selector: 'app-agent-login',
  standalone: true,
imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './agent-login.html',
  styleUrl: './agent-login.css', 
  host: { '[class.light-theme]': '!themeService.isDarkMode()' }
})
export class AgentLoginComponent {
  themeService = inject(ThemeService);
  agentService = inject(AgentService);
  router = inject(Router);
  
  showPassword = false;

  agentForm = new FormGroup({
    matricule: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onAgentLogin() {
    if (this.agentForm.valid) {
      // ثبت إنو ميثود الـ login موجودة في الـ agentService
      this.agentService.login(this.agentForm.value).subscribe({
        next: (agent: any) => {
          localStorage.setItem('currentUser', JSON.stringify(agent));
          localStorage.setItem('role', 'AGENT');
          alert('Bienvenue Agent ' + agent.nom + ' !');
          this.router.navigate(['/agent-dashboard']); // لازم تزيد الـ Route هذا في app.routes.ts
        },
        error: (err) => alert(err.error || 'Erreur de connexion Agent')
      });
    }
  }

  toggleTheme() { this.themeService.toggleTheme(); }
  togglePassword() { this.showPassword = !this.showPassword; }
}