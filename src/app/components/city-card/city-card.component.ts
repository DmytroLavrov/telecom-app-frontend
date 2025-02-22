import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { ICity } from '../../interfaces/city';
import { MatIconModule } from '@angular/material/icon';
import { CityService } from '../../services/city.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { EditCityComponent } from '../edit-city/edit-city.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-city-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './city-card.component.html',
  styleUrl: './city-card.component.scss',
})
export class CityCardComponent {
  private destroyRef = inject(DestroyRef);
  cityService = inject(CityService);
  private dialog = inject(MatDialog);
  private snackbarService = inject(SnackbarService);

  city = input.required<ICity>();
  cityDeleted = output<string>();
  cityUpdated = output<ICity>();

  openEditSubscriberDialog() {
    const buttonElement = document.activeElement as HTMLElement;
    if (buttonElement) {
      buttonElement.blur();
    }

    const dialogRef = this.dialog.open(EditCityComponent, {
      data: this.city(),
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((updatedCity) => {
      if (updatedCity) {
        this.cityUpdated.emit(updatedCity);
      }
    });
  }

  deleteCity(id: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message:
          'Are you sure you want to delete this city?\nAll calls associated with this city will also be deleted.',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.cityService
            .deleteCity(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.snackbarService.showMessage(
                  'City deleted successfully',
                  'success'
                );
                this.cityDeleted.emit(id);
              },
              error: (err: Error) => {
                this.snackbarService.showMessage(
                  `Error: ${err.message}`,
                  'error'
                );
              },
            });
        }
      });
  }
}
