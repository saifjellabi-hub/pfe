import { Component,inject  } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ThemeService } from '../theme';

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
  isDarkMode = true; // Default to dark
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
      console.log('Admin Login:', this.adminForm.value);
    }
  }
}

