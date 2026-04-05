import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: { message: string; type: 'success' | 'error' | 'info' },
  ) {}

  get iconName(): string {
    switch (this.data.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'cancel';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  }
}
