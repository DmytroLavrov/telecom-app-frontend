import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ITokenResponse } from '../../interfaces/admin';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);
  private destroyRef = inject(DestroyRef);

  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const subscription = this.adminService
      .login({
        email: this.form.value.email!,
        password: this.form.value.password!,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ITokenResponse) => {
          this.router.navigate(['']);
          this.snackbarService.showMessage('Login successful!', 'success');
        },
        error: (err) => {
          console.error('Request error:', err.message);
          this.snackbarService.showMessage(
            'Incorrect email or password.',
            'error'
          );
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
