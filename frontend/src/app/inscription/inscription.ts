import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inscription',
  standalone: true, 
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './inscription.html',
  styleUrl: './inscription.css'
})
export class InscriptionComponent {

  registerForm!: FormGroup;
  showPassword = false;
  isDarkMode = true;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      cin: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(18)]],
      phone: ['', Validators.required, Validators.pattern('^[0-9]{8,12}$')],
      soldeInitial: ['', [Validators.required, Validators.min(50)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  passwordMatch(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const host = document.querySelector('app-inscription');
    host?.classList.toggle('light-theme', !this.isDarkMode);
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      alert('Compte créé (simulation)');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
