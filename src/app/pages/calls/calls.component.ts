import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CallService } from '../../services/call.service';
import { ICall } from '../../interfaces/call';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PhoneNumberFormatPipe } from '../../pipes/phone-number-format.pipe';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DurationFormatPipe } from '../../pipes/duration-format.pipe';
import { MatDialog } from '@angular/material/dialog';
import { AddCallComponent } from '../../components/add-call/add-call.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-calls',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    PhoneNumberFormatPipe,
    CurrencyPipe,
    DatePipe,
    DurationFormatPipe,
  ],
  templateUrl: './calls.component.html',
  styleUrl: './calls.component.scss',
})
export class CallsComponent {
  private destroyRef = inject(DestroyRef);
  private callService = inject(CallService);
  private dialog = inject(MatDialog);

  calls = signal<ICall[]>([]);
  isLoading = signal(true);
  searchTerm = signal<string>('');
  filterOption = signal<string>('all');

  filteredCalls = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const option = this.filterOption();

    let sortedCalls = this.calls().filter(
      (s) =>
        s.subscriber.toLowerCase().includes(term) ||
        s.city.toLowerCase().includes(term) ||
        s.duration.toString().includes(term) ||
        s.timeOfDay.toLowerCase().includes(term)
    );

    switch (option) {
      case 'newest':
        sortedCalls.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case 'oldest':
        sortedCalls.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case 'longest':
        sortedCalls.sort((a, b) => b.duration - a.duration);
        break;
      case 'shortest':
        sortedCalls.sort((a, b) => a.duration - b.duration);
        break;
      case 'most_expensive':
        sortedCalls.sort((a, b) => b.cost - a.cost);
        break;
      case 'cheapest':
        sortedCalls.sort((a, b) => a.cost - b.cost);
        break;
    }

    return sortedCalls;
  });

  ngOnInit() {
    const subscription = this.callService.getCalls().subscribe({
      next: (data) => {
        this.calls.set(data);
        console.log(data);
      },
      complete: () => {
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        console.error('Error loading cities:', err.message);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  openAddCallDialog() {
    const buttonElement = document.activeElement as HTMLElement;
    if (buttonElement) {
      buttonElement.blur();
    }

    const dialogRef = this.dialog.open(AddCallComponent, {
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const subscription = this.callService
          .getCalls()
          .subscribe((updatedCalls) => {
            this.calls.set(updatedCalls);
          });

        this.destroyRef.onDestroy(() => {
          subscription.unsubscribe();
        });
      }
    });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.filterOption.set(target.value);
  }

  deleteCall(callId: string) {
    const subscription = this.callService.deleteCall(callId).subscribe({
      next: () => {
        this.calls.set(this.calls().filter((call) => call._id !== callId));
      },
      error: (err: Error) => {
        console.error('Error deleting call:', err.message);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
