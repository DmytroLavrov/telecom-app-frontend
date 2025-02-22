import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { INewSubscriber, ISubscriber } from '../../interfaces/subscriber';
import { SubscriberService } from '../../services/subscriber.service';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-edit-subscriber',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './edit-subscriber.component.html',
  styleUrl: './edit-subscriber.component.scss',
})
export class EditSubscriberComponent {
  private fb = inject(FormBuilder);
  private subscriberService = inject(SubscriberService);
  private dialogRef = inject(MatDialogRef<EditSubscriberComponent>);
  private snackbarService = inject(SnackbarService);
  private destroyRef = inject(DestroyRef);
  private data = inject<ISubscriber>(MAT_DIALOG_DATA);

  subscriberForm: FormGroup = this.fb.group({
    phoneNumber: [
      this.data.phoneNumber,
      [Validators.required, Validators.pattern('^\\+?[0-9]{10}$')],
    ],
    edrpou: [
      this.data.edrpou,
      [Validators.required, Validators.pattern('^\\+?[0-9]{8}$')],
    ],
    address: [
      this.data.address,
      [Validators.required, Validators.minLength(5)],
    ],
  });

  onSubmit() {
    if (this.subscriberForm.invalid) {
      this.subscriberForm.markAllAsTouched();
      return;
    }

    const formData: INewSubscriber = this.subscriberForm.value;

    const subscription = this.subscriberService
      .updateSubscriber(this.data._id, formData)
      .subscribe({
        next: (updatedSubscriber) => {
          this.snackbarService.showMessage(
            'Subscriber updated successfully',
            'success'
          );
          this.dialogRef.close(updatedSubscriber);
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
