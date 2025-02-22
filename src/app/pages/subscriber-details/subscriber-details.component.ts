import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriberService } from '../../services/subscriber.service';
import { ISubscriberDetails } from '../../interfaces/subscriber';
import { SnackbarService } from '../../services/snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PhoneNumberFormatPipe } from '../../pipes/phone-number-format.pipe';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DurationFormatPipe } from '../../pipes/duration-format.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-subscriber-details',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    PhoneNumberFormatPipe,
    CurrencyPipe,
    DatePipe,
    DurationFormatPipe,
  ],
  templateUrl: './subscriber-details.component.html',
  styleUrl: './subscriber-details.component.scss',
})
export class SubscriberDetailsComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private subscriberService = inject(SubscriberService);
  private snackbarService = inject(SnackbarService);

  subscriber = signal<ISubscriberDetails | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const subscription = this.subscriberService
        .getSubscriberDetails(id)
        .subscribe({
          next: (data) => {
            this.subscriber.set(data);
            console.log(data);
          },
          complete: () => {
            this.isLoading.set(false);
          },
          error: (err: Error) => {
            console.error('Error loading subscriber details:', err.message);
            this.snackbarService.showMessage(
              'Error loading subscriber details',
              'error'
            );
            this.router.navigate(['/subscribers']);
          },
        });

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
  }

  navigateToSubscribers(): void {
    this.router.navigate(['/subscribers']);
  }
}
