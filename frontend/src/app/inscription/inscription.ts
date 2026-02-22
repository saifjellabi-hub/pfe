import { Component } from '@angular/core';
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
export class InscriptionComponent {

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
      age: ['', [Validators.required, Validators.min(18)]],
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
    
    const payload = {
      nom: this.registerForm.value.nom,
      prenom: this.registerForm.value.prenom,
      ncin: this.registerForm.value.cin, 
      email: this.registerForm.value.email,
      age: this.registerForm.value.age,
      tel: this.registerForm.value.phone, 
      soldeInitial: this.registerForm.value.soldeInitial,
      rib: this.registerForm.value.rib.replace(/\s/g, ''),
      password: this.registerForm.value.password
    };

    this.clientService.register(payload).subscribe({
      next: (response) => {
        console.log('Success!', response);
        alert('Inscription réussie !');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error!', err);
        alert('Erreur: ' + (err.error || 'Problème de connexion au serveur'));
      }
    });
  }
}
// ميثود تعمل الـ Formatting للـ RIB
onRibInput(event: any) {
  let value = event.target.value.replace(/\D/g, ''); // نحيو أي حاجة موش رقم
  if (value.length > 20) value = value.substring(0, 20); // نحددو لـ 20 رقم فقط

  // تقسيم الـ 20 رقم لمجموعات (مثلاً 5-5-5-5)
  const formattedValue = value.match(/.{1,5}/g)?.join(' ') || value;
  
  // تحديث القيمة في الفورم
  this.registerForm.patchValue({ rib: formattedValue }, { emitEvent: false });
}
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
