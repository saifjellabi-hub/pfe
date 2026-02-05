import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-demande-credit',
  standalone: true,
  imports: [CommonModule,RouterModule, FormsModule],
  templateUrl: './demande-credit.html',
  styleUrls: ['./demande-credit.css']
})
export class DemandeCredit {}
