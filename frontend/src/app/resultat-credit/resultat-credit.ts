import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-resultat-credit',
  standalone: true,
  templateUrl: './resultat-credit.html',
  styleUrl: './resultat-credit.css',
  imports : [CommonModule,RouterModule]
})
export class ResultatCredit {
  score: number = 85; 
  decision: string = 'Accordé';
}
