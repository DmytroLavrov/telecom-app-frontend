import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { ISubscriberCard } from '../../interfaces/subscriber';
import { RouterLink } from '@angular/router';
import { PhoneNumberFormatPipe } from '../../pipes/phone-number-format.pipe';
import { MatIconModule } from '@angular/material/icon';
import { SubscriberService } from '../../services/subscriber.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { EditSubscriberComponent } from '../edit-subscriber/edit-subscriber.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-subscriber-card',
  standalone: true,
  imports: [RouterLink, PhoneNumberFormatPipe, MatIconModule],
  templateUrl: './subscriber-card.component.html',
  styleUrl: './subscriber-card.component.scss',
})
export class SubscriberCardComponent {
  private destroyRef = inject(DestroyRef);
  subscriberService = inject(SubscriberService);
  private dialog = inject(MatDialog);
  private snackbarService = inject(SnackbarService);

  subscriber = input.required<ISubscriberCard>();
  subscriberDeleted = output<string>();
  subscriberUpdated = output<ISubscriberCard>();

  openEditSubscriberDialog() {
    const buttonElement = document.activeElement as HTMLElement;
    if (buttonElement) {
      buttonElement.blur();
    }

    const dialogRef = this.dialog.open(EditSubscriberComponent, {
      data: this.subscriber(),
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((updatedSubscriber) => {
      if (updatedSubscriber) {
        this.subscriberUpdated.emit(updatedSubscriber);
      }
    });
  }

  deleteSubscriber(id: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message:
          'Are you sure you want to delete this subscriber?\nAll calls associated with this subscriber will also be deleted.',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.subscriberService
            .deleteSubscriber(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.snackbarService.showMessage(
                  'Subscriber deleted successfully',
                  'success'
                );
                this.subscriberDeleted.emit(id);
              },
              error: (err: Error) => {
                const errorMessage =
                  err?.message || 'An unknown error occurred';
                this.snackbarService.showMessage(
                  `Error: ${errorMessage}`,
                  'error'
                );
              },
            });
        }
      });
  }
}
