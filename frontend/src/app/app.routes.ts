import { Routes } from '@angular/router';

import { ClientComponent } from './client/client';
import { DemandeCredit } from './demande-credit/demande-credit';
import { ResultatCredit } from './resultat-credit/resultat-credit';

export const routes: Routes = [

  { path: '', redirectTo: 'client', pathMatch: 'full' },
  { path: 'client', component: ClientComponent },
  { path: 'demande-credit', component: DemandeCredit },
  { path: 'resultat-credit', component: ResultatCredit },
  { path: '**', redirectTo: 'client' }
];
