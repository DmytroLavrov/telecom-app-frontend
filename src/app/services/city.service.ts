import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICity, INewCity } from '../interfaces/city';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private http = inject(HttpClient);
  private backendUrl = `${environment.apiUrl}/cities`;

  public getCities(): Observable<ICity[]> {
    return this.http.get<ICity[]>(`${this.backendUrl}`).pipe(
      catchError((err) => {
        console.error('Error fetching cities:', err);
        return throwError(
          () => new Error('An error occurred while fetching the cities list'),
        );
      }),
    );
  }

  public addCity(city: INewCity): Observable<INewCity> {
    return this.http.post<INewCity>(this.backendUrl, city).pipe(
      catchError((err) => {
        console.error('Error adding city:', err);
        return throwError(() => err);
      }),
    );
  }

  public updateCity(
    id: string,
    updatedCity: Partial<INewCity>,
  ): Observable<ICity> {
    return this.http.put<ICity>(`${this.backendUrl}/${id}`, updatedCity).pipe(
      catchError((err) => {
        console.error('Error updating city:', err);
        return throwError(() => err);
      }),
    );
  }

  public deleteCity(id: string): Observable<void> {
    return this.http.delete<void>(`${this.backendUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('Error deleting city:', err);
        return throwError(
          () => new Error('An error occurred while deleting the city'),
        );
      }),
    );
  }
}
