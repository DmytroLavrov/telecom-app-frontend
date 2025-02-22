import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { SubscriberService } from '../../services/subscriber.service';
import { ISubscriberCard } from '../../interfaces/subscriber';
import { SubscriberCardComponent } from '../../components/subscriber-card/subscriber-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { AddSubscriberComponent } from '../../components/add-subscriber/add-subscriber.component';

@Component({
  selector: 'app-subscribers',
  standalone: true,
  imports: [SubscriberCardComponent, MatProgressSpinnerModule],
  templateUrl: './subscribers.component.html',
  styleUrl: './subscribers.component.scss',
})
export class SubscribersComponent {
  private destroyRef = inject(DestroyRef);
  subscriberService = inject(SubscriberService);
  private dialog = inject(MatDialog);

  subscribers = signal<ISubscriberCard[]>([]);
  isLoading = signal(true);
  searchTerm = signal<string>('');

  filteredSubscribers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    return this.subscribers().filter(
      (s) =>
        s._id.toLowerCase().includes(term) ||
        s.phoneNumber.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    const subscription = this.subscriberService.getSubscribers().subscribe({
      next: (data) => {
        this.subscribers.set(data);
      },
      complete: () => {
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        console.error('Error loading subscribers:', err.message);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  openAddSubscriberDialog() {
    const buttonElement = document.activeElement as HTMLElement;
    if (buttonElement) {
      buttonElement.blur();
    }

    const dialogRef = this.dialog.open(AddSubscriberComponent, {
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.subscribers.set([...this.subscribers(), result]);
      }
    });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onSubscriberDeleted(id: string) {
    this.subscribers.set(this.subscribers().filter((s) => s._id !== id));
  }

  onSubscriberUpdated(updatedSubscriber: ISubscriberCard) {
    this.subscribers.set(
      this.subscribers().map((s) =>
        s._id === updatedSubscriber._id ? { ...s, ...updatedSubscriber } : s
      )
    );
  }
}
