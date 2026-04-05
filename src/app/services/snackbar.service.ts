import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '@components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private _snackBar = inject(MatSnackBar);

  public showMessage(
    message: string,
    type: 'success' | 'error' | 'info' = 'success',
  ): void {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: { message, type },
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [type],
    });
  }
}
