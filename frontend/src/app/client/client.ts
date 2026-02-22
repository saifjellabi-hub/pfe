import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-client',
  standalone: true,
  templateUrl: './client.html',
  styleUrls: ['./client.css'],
  imports: [RouterModule, CommonModule]
})
export class ClientComponent implements OnInit {
  currentUser: any;

  ngOnInit(): void {
   
    const data = localStorage.getItem('currentUser');
    if (data) {
      this.currentUser = JSON.parse(data);
    }
  }
  
}