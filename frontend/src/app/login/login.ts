import { take } from 'rxjs/operators';
import { Component,inject, OnInit, Renderer2, ElementRef } from '@angular/core'; 
import { FormsModule,FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  host: {
      '[class.light-theme]': '!themeService.isDarkMode()'
    }
})
export class LoginComponent implements OnInit {
  showForgotForm = false;
  resetStep = 1; 
  resetEmail = '';
  loginForm!: FormGroup;
  errorMessage: string = '';
  generatedCaptcha: string = '';
  captchaInput: string = '';
  showPassword = false;
  inputOtp: string = '';
  newPassword = '';
  confirmPassword = '';
  isProcessing = false;
  
goToForgotPassword() {
    this.showForgotForm = true;
    this.resetStep = 1;
    this.cdr.detectChanges();
  }
verifyAccount() {
  if (this.isProcessing) return; // إذا فمة طلب قاعد يخدم، أخرج
  this.isProcessing = true;

  this.clientService.forgotPassword(this.resetEmail).pipe(take(1)).subscribe({
    next: (res: any) => {
      this.resetStep = 2;
      this.isProcessing = false; // رجعها false كملنا
      this.cdr.detectChanges();
      alert("Un code de vérification a été envoyé.");
    },
    error: (err) => {
      this.isProcessing = false;
      if (err.status === 200) {
        this.resetStep = 2;
        this.cdr.detectChanges();
      } else {
        alert("Erreur : Compte non trouvé.");
      }
    }
  });
}

verifyOtp() {
  if (this.isProcessing) return;
  this.isProcessing = true;

  this.clientService.verifyOtp(this.resetEmail, this.inputOtp).pipe(take(1)).subscribe({
    next: (res) => {
      this.isProcessing = false;
      // التغيير الفوري هنا
      this.resetStep = 3; 
      this.cdr.markForCheck(); // أقوى من detectChanges ساعات
      this.cdr.detectChanges();
      
      console.log("Passage à l'étape 3 réussi");
    },
    error: (err) => {
      this.isProcessing = false;
      alert("Code incorrect.");
      this.cdr.detectChanges();
    }
  });
}
cancelForgot() {
  this.showForgotForm = false;
  this.resetStep = 1;
  this.inputOtp = ''; 
}
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
    this.generateCaptcha();
    this.loginForm = this.fb.group({
      cin: ['', [Validators.required, Validators.pattern("^[0-9]{8}$")]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      captcha: ['', [Validators.required]],
      newPassword: [''],
      confirmPassword: ['']
    });
  }
generateCaptcha() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 6; i++) { 
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.generatedCaptcha = result;
    this.captchaInput = ''; 
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }


isFirstTime = false; 

onLogin() {
  const val = this.loginForm.value;
 const inputTyped = val.captcha?.trim().toLowerCase(); 
  const currentCaptcha = this.generatedCaptcha.toLowerCase();

 if (inputTyped !== currentCaptcha) {
    alert("Le code de vérification est incorrect !");
    this.generateCaptcha();
    return;
  }
if (this.loginForm.invalid) {
    alert("Veuillez remplir tous les champs correctement.");
    return;
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

  resetPassword() {
  if (this.newPassword !== this.confirmPassword) {
    alert("Les mots de passe ne correspondent pas !");
    return;
  }
  if (this.newPassword.length < 6) {
    alert("Le mot de passe doit contenir au moins 6 caractères.");
    return;
  }

  this.clientService.updatePassword(this.resetEmail, this.newPassword).subscribe({
    next: (res) => {
      alert("Mot de passe modifié avec succès ! Vous pouvez maintenant vous connecter.");
      this.showForgotForm = false; 
      this.resetStep = 1;
      this.cdr.detectChanges();
    },
    error: (err) => {
      alert("Une erreur est survenue lors de la modification. Veuillez réessayer.");
    }
  });
}

}