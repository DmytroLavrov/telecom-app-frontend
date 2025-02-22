import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  INewSubscriber,
  ISubscriber,
  ISubscriberCard,
  ISubscriberDetails,
} from '../interfaces/subscriber';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriberService {
  private http = inject(HttpClient);
  private backendUrl = 'https://telecom-app-backend.onrender.com/subscribers';

  public getSubscribers(): Observable<ISubscriberCard[]> {
    return this.http.get<ISubscriberCard[]>(this.backendUrl).pipe(
      catchError((err) => {
        console.error('Error fetching subscribers:', err);
        return throwError(
          () =>
            new Error('An error occurred while fetching the subscribers list')
        );
      })
    );
  }

  public getSubscriberDetails(id: string): Observable<ISubscriberDetails> {
    return this.http.get<ISubscriberDetails>(`${this.backendUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('Error fetching subscriber details:', err);
        return throwError(
          () =>
            new Error('An error occurred while fetching the subscriber details')
        );
      })
    );
  }

  public addSubscriber(
    subscriber: INewSubscriber
  ): Observable<ISubscriberCard> {
    return this.http.post<ISubscriberCard>(this.backendUrl, subscriber).pipe(
      catchError((err) => {
        console.error('Error adding subscriber:', err);
        return throwError(() => err);
      })
    );
  }

  public updateSubscriber(
    id: string,
    updatedSubscriber: Partial<INewSubscriber>
  ): Observable<ISubscriber> {
    return this.http
      .put<ISubscriber>(`${this.backendUrl}/${id}`, updatedSubscriber)
      .pipe(
        catchError((err) => {
          console.error('Error updating subscriber:', err);
          return throwError(() => err);
        })
      );
  }

  public deleteSubscriber(id: string): Observable<void> {
    return this.http.delete<void>(`${this.backendUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('Error deleting subscriber:', err);
        return throwError(
          () => new Error('An error occurred while deleting the subscriber')
        );
      })
    );
  }
}
