import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICall, INewCall } from '../interfaces/call';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  private http = inject(HttpClient);
  private backendUrl = `${environment.apiUrl}/calls`;

  public getCalls(): Observable<ICall[]> {
    return this.http.get<ICall[]>(`${this.backendUrl}`).pipe(
      catchError((err) => {
        console.error('Error fetching calls:', err);
        return throwError(
          () => new Error('An error occurred while fetching the calls list'),
        );
      }),
    );
  }

  public addCall(call: INewCall): Observable<ICall> {
    return this.http.post<ICall>(this.backendUrl, call).pipe(
      catchError((err) => {
        console.error('Error adding call:', err);
        return throwError(
          () => new Error('An error occurred while adding the call'),
        );
      }),
    );
  }

  public deleteCall(id: string): Observable<void> {
    return this.http.delete<void>(`${this.backendUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('Error deleting call:', err);
        return throwError(
          () => new Error('An error occurred while deleting the call'),
        );
      }),
    );
  }
}
