import { Component,inject, OnInit, Renderer2, ElementRef } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  host: {
      '[class.light-theme]': '!themeService.isDarkMode()'
    }
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  showPassword = false;
  

  //theme
  themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }


  constructor(
    private fb: FormBuilder, 
    private clientService: ClientService,
    private router: Router, 
    private renderer: Renderer2, 
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      cin: ['', [Validators.required, Validators.pattern("^[0-9]{8}$")]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: [''],
      confirmPassword: ['']
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


isFirstTime = false; 

onLogin() {
  const val = this.loginForm.value;

  
  if (this.isFirstTime) {
    if (val.newPassword !== val.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !"); 
      return;
    }
    
  }
  const credentials = {
    ncin: val.cin,
    password: val.password,
    newPassword: val.newPassword
  };

  this.clientService.login(credentials).subscribe({
    next: (res: any) => {
      if (res.role !== 'USER') {
      alert("Accès refusé : Vous n'êtes pas un client.");
      return;
    }
      if (this.isFirstTime) {
       
        alert('Mot de passe mis à jour avec succès ! Veuillez vous connecter avec votre nouveau mot de passe.');
        
     
        this.isFirstTime = false;
        this.loginForm.reset(); 
        this.router.navigate(['/login']); 
      } else {
        
        localStorage.setItem('currentUser', JSON.stringify(res));
        alert('Connexion réussie !');
        this.router.navigate(['/client']);
      }
    },
    error: (err) => {
      if (err.status === 206) {
          alert('Première connexion : Veuillez définir votre nouveau mot de passe.');
          this.isFirstTime = true;
          this.cdr.detectChanges();
      }else {
        alert(err.error || 'Erreur de connexion');
      }
    }
  });
}
  goToRegister() {
    this.router.navigate(['/inscription']);
  }

  goToForgotPassword() {
    console.log("Redirect to forgot password");
  }

}