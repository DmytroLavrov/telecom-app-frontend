import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AdminService } from '@services/admin.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AdminService).token;

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: token,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};
