import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';     
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { AgentService } from '../services/agent.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agent-form',
  standalone: true,   
  imports: [CommonModule, ReactiveFormsModule],  
  templateUrl: './agent-form.html',
  styleUrls: ['./agent-form.css']
})
export class AgentFormComponent {
  agentForm: FormGroup;
  showPassword = false;
  isDarkMode = true;

  constructor(private fb: FormBuilder,
    private agentService: AgentService,
     private router: Router) {
    
    this.agentForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{8}$")]],
      cin: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      matricule: ['', Validators.required]},
       { validators: this.passwordMatchValidator }
    );
  }
  passwordMatchValidator(group: FormGroup) {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
toggleTheme() {
  this.isDarkMode = !this.isDarkMode;

  const host = document.querySelector('app-agent-form') as HTMLElement;
  if (this.isDarkMode) {
    host.classList.remove('light-theme');
  } else {
    host.classList.add('light-theme');
  }
}
 togglePassword() {
    this.showPassword = !this.showPassword;
  }
 onSubmit() {
  if (this.agentForm.valid) {
    
    const payload = {
      nom: this.agentForm.value.nom,
      prenom: this.agentForm.value.prenom,
      email: this.agentForm.value.email,
      cin: this.agentForm.value.cin,
      phone: this.agentForm.value.phone,
      password: this.agentForm.value.password,
      matricule: this.agentForm.value.matricule
    };

    this.agentService.registerAgent(payload).subscribe({
      next: (res) => {
        alert('Agent ajouté avec succès !');
        this.agentForm.reset();
      },
      error: (err) => {
        alert(err.error || 'Erreur lors de l\'ajout');
      }
    });
  }
}
}
