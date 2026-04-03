import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-inscription',
  standalone: true, 
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './inscription.html',
  styleUrl: './inscription.css'
})
export class InscriptionComponent implements OnInit {

  registerForm!: FormGroup;
  showPassword = false;
  isDarkMode = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      cin: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      dateNaissance: ['', Validators.required],
      age: [{value: '', disabled: true}, Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8,12}$')]],
      soldeInitial: ['', [Validators.required, Validators.min(50)]],
      rib: ['', [Validators.required, Validators.minLength(23), Validators.maxLength(23)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  passwordMatch(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  onDateChange(event: any) {
    const birthDate = new Date(event.target.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.registerForm.patchValue({ age: age });
  }

  onRibInput(event: any) {
    let value = event.target.value.replace(/\D/g, ''); 
    if (value.length > 20) value = value.substring(0, 20); 
    const formattedValue = value.match(/.{1,5}/g)?.join(' ') || value;
    this.registerForm.patchValue({ rib: formattedValue }, { emitEvent: false });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const formValues = this.registerForm.getRawValue();
      const payload = {
        nom: formValues.nom,
        prenom: formValues.prenom,
        ncin: formValues.cin, 
        email: formValues.email,
        dateNaissance: formValues.dateNaissance,
        age: formValues.age,
        tel: formValues.phone, 
        soldeInitial: formValues.soldeInitial,
        rib: formValues.rib.replace(/\s/g, ''),
        password: formValues.password
      };

      this.clientService.register(payload).subscribe({
        next: (response) => {
          alert('Inscription réussie !');
          this.router.navigateByUrl('/admin');
        },
        error: (err) => {
          alert('Erreur: ' + (err.error || 'Problème de connexion'));
        }
      });
    }
  }

  togglePassword() { this.showPassword = !this.showPassword; }
  
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const host = document.querySelector('app-inscription');
    host?.classList.toggle('light-theme', !this.isDarkMode);
  }

  goToLogin() { this.router.navigate(['/admin']); }

} 