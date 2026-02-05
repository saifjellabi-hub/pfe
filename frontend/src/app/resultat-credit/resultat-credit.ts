import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreditService } from '../services/credit';


@Component({
  selector: 'app-resultat-credit',
  standalone: true,
  templateUrl: './resultat-credit.html',
  styleUrl: './resultat-credit.css',
  imports : [CommonModule,RouterModule]
})

export class ResultatCredit implements OnInit {
  score: number = 85; 
  decision: string = 'Accordé';
  
  constructor(private creditService: CreditService) {}
  
  ngOnInit() {
    this.score = this.creditService.getScore();
    if (this.score >= 50) {
      this.decision = 'Accordé';
    } else {
      this.decision = 'Refusé';
    }
  }

}
