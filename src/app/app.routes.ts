import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { authGuard } from './core/auth/auth-guard';
import { TripDetails } from './features/trip-details/trip-details';
import { MatchJournal } from './features/match-journal/match-journal';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'trip/:id', component: TripDetails, canActivate: [authGuard] },
  { path: 'trip/:id/journal', component: MatchJournal, canActivate: [authGuard] },

  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: '**', redirectTo: '/login' }
];
