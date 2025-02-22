import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IAdminLogin, ITokenResponse } from '../interfaces/admin';
import { tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private backendUrl = 'https://telecom-app-backend.onrender.com/auth';
  private cookieService = inject(CookieService);
  private router = inject(Router);

  public token: string | null = null;

  public get isAuth(): boolean {
    if (!this.token) {
      this.token = this.cookieService.get('Token');
    }
    return !!this.token;
  }

  public login(payload: IAdminLogin) {
    return this.http
      .post<ITokenResponse>(`${this.backendUrl}/login`, payload)
      .pipe(
        tap((val) => {
          this.token = val.token;

          this.cookieService.set('Token', this.token);
        })
      );
  }

  public logout(): void {
    this.token = null;
    this.cookieService.delete('Token');
    this.router.navigate(['/login']);
  }
}
