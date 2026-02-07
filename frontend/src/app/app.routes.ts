import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { InscriptionComponent } from './inscription/inscription'; 
import { ClientComponent } from './client/client';
import { DemandeCredit } from './demande-credit/demande-credit';
import { ResultatCredit } from './resultat-credit/resultat-credit';

export const routes: Routes = [

  { path: '', redirectTo: 'client', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inscription', component: InscriptionComponent},
  { path: 'client', component: ClientComponent },
  { path: 'demande-credit', component: DemandeCredit },
  { path: 'resultat-credit', component: ResultatCredit },
  { path: '**', redirectTo: 'client' }
];
