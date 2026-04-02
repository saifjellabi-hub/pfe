import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditService } from '../services/credit.service';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router'; // زدنا هذي باش الـ routerLink يخدم

@Component({
  selector: 'app-resultat-credit',
  standalone: true,
  imports: [CommonModule, RouterModule], // أهوكا زدتلك الـ RouterModule هوني
  templateUrl: './resultat-credit.html',
  styleUrls: ['./resultat-credit.css']
})
export class ResultatCredit implements OnInit {
  selectedFilePreviews: string[] = [];
  demande: any = null; 
  currentUser: any;
  isLoading: boolean = true; 
  getFileArray(justificatifUrl: string): string[] {
  if (!justificatifUrl) return [];
  // تقسيم النص بـ الفاصلة وتنظيف الفراغات
  return justificatifUrl.split(',').map(f => f.trim());
}

  constructor(private creditService: CreditService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      
      this.isLoading = true; // 2. يبدأ الـ Loading توة

      this.creditService.getDemandesByClient(this.currentUser.ncin).subscribe({
        next: (data) => {
          this.demande = data; 
          this.isLoading = false; 
          
          if (this.demande) {
            this.selectedFilePreviews = this.demande.previews || [];
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Erreur:", err);
          this.isLoading = false; // 4. حتى كان فما Error، نوقفو الـ Loading باش تظهر الـ Empty State
          this.cdr.detectChanges();
        }
      });
    }
  }
}