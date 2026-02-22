import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { INewSubscriber } from '@interfaces/subscriber';
import { SubscriberService } from '@services/subscriber.service';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '@services/snackbar.service';

@Component({
  selector: 'app-add-subscriber',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './add-subscriber.component.html',
  styleUrl: './add-subscriber.component.scss',
})
export class AddSubscriberComponent {
  private subscriberService = inject(SubscriberService);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddSubscriberComponent>);
  private snackbarService = inject(SnackbarService);
  private destroyRef = inject(DestroyRef);

  subscriberForm: FormGroup = this.fb.group({
    phoneNumber: [
      '',
      [Validators.required, Validators.pattern('^\\+?[0-9]{10}$')],
    ],
    edrpou: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{8}$')]],
    address: ['', [Validators.required, Validators.minLength(5)]],
  });

  onSubmit() {
    if (this.subscriberForm.invalid) {
      this.subscriberForm.markAllAsTouched();
      return;
    }

    const formData: INewSubscriber = this.subscriberForm.value;

    const subscription = this.subscriberService
      .addSubscriber(formData)
      .subscribe({
        next: (newSubscriber) => {
          this.dialogRef.close(newSubscriber);
          this.snackbarService.showMessage(
            'New subscriber added successfully!',
            'success',
          );
        },
        error: () => {},
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
