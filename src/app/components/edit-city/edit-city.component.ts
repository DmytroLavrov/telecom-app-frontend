import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICity, INewCity } from '../../interfaces/city';
import { CityService } from '../../services/city.service';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-edit-city',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './edit-city.component.html',
  styleUrl: './edit-city.component.scss',
})
export class EditCityComponent {
  private fb = inject(FormBuilder);
  private cityService = inject(CityService);
  private dialogRef = inject(MatDialogRef<EditCityComponent>);
  private snackbarService = inject(SnackbarService);
  private destroyRef = inject(DestroyRef);
  private data = inject<ICity>(MAT_DIALOG_DATA);

  cityForm: FormGroup = this.fb.group({
    name: [this.data.name, [Validators.required, Validators.minLength(3)]],
    dayRate: [this.data.dayRate, [Validators.required, Validators.min(0)]],
    nightRate: [this.data.nightRate, [Validators.required, Validators.min(0)]],
    discounts: this.fb.array(
      this.data.discounts.map((discount) =>
        this.createDiscountGroup({
          ...discount,
          discountRate: discount.discountRate * 100,
        })
      )
    ),
  });

  get discounts(): FormArray {
    return this.cityForm.get('discounts') as FormArray;
  }

  createDiscountGroup(
    discount: { duration?: number; discountRate?: number } = {}
  ) {
    return this.fb.group({
      duration: [discount.duration, [Validators.required, Validators.min(1)]],
      discountRate: [
        discount.discountRate,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });
  }

  addDiscount() {
    if (this.discounts.length >= 3) {
      return;
    }

    this.discounts.push(this.createDiscountGroup());
  }

  removeDiscount(index: number) {
    this.discounts.removeAt(index);
  }

  onSubmit() {
    if (this.cityForm.invalid) {
      this.cityForm.markAllAsTouched();
      return;
    }

    const updatedCity: Partial<INewCity> = this.cityForm.value;

    const subscription = this.cityService
      .updateCity(this.data._id, updatedCity)
      .subscribe({
        next: (result) => {
          this.snackbarService.showMessage(
            'City updated successfully',
            'success'
          );
          this.dialogRef.close(result);
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
