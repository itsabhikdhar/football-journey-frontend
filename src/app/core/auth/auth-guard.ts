import { CanActivateFn } from '@angular/router';
import { Auth } from './auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
