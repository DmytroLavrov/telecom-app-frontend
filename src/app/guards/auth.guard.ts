import { inject } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';

export const authGuard = () => {
  const authService = inject(AdminService);
  const router = inject(Router);

  if (authService.isAuth) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
