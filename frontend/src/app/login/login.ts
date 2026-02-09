import { Component,inject, OnInit, Renderer2, ElementRef } from '@angular/core'; // زدنا Renderer2 و ElementRef هنا
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme'; // Adjust path if needed

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
  isDarkMode = true; // الثيم الغامق هو الافتراضي كيف Spring Initializr

  //theme
  themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }


  // كونسراكتور واحد يجمع كل شيء
  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private renderer: Renderer2, 
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      cin: ['', [Validators.required, Validators.pattern("^[0-9]{8}$")]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  onLogin() {
    if (this.loginForm.valid) {
      console.log("Données:", this.loginForm.value);
      this.router.navigate(['/client']);
    } else {
      this.errorMessage = "ثبت في المعطيات متاعك!";
    }
  }

  goToRegister() {
    this.router.navigate(['/inscription']);
  }

  goToForgotPassword() {
    console.log("Redirect to forgot password");
  }
}