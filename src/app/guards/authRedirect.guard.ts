import { inject } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';

export const authRedirectGuard = () => {
  const authService = inject(AdminService);
  const router = inject(Router);

  if (authService.isAuth) {
    return router.createUrlTree(['/']);
  }

  return true;
};
