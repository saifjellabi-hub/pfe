import { Component,inject  } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ThemeService } from '../theme';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
  host: {
      '[class.light-theme]': '!themeService.isDarkMode()'
    }
    
})
export class AdminLoginComponent {
  themeService = inject(ThemeService);
  clientService = inject(ClientService);
  router = inject(Router);
  
  showPassword = false;

  // Form for Admin (using 'username' or 'email' instead of 'cin')
  adminForm = new FormGroup({
    adminId: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  
  toggleTheme() {
    this.themeService.toggleTheme();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

 onAdminLogin() {
  if (this.adminForm.valid) {
    const credentials = {
      ncin: this.adminForm.value.adminId, // حسب الـ Input في الصورة
      password: this.adminForm.value.password
    };

    this.clientService.loginAdmin(credentials).subscribe({
      next: (admin) => {
        localStorage.setItem('currentUser', JSON.stringify(admin));
        alert('Bienvenue Admin !');
        this.router.navigate(['/admin']); // التوجه للوحة تحكم الأدمن
      },
      error: (err) => {
        alert(err.error || 'Erreur de connexion Admin');
      }
    });
  }
}
}

