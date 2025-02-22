import { Component, DestroyRef, inject } from '@angular/core';
import { CityService } from '../../services/city.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { INewCity } from '../../interfaces/city';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-city',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './add-city.component.html',
  styleUrl: './add-city.component.scss',
})
export class AddCityComponent {
  private cityService = inject(CityService);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddCityComponent>);
  private snackbarService = inject(SnackbarService);
  private destroyRef = inject(DestroyRef);

  cityForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    dayRate: ['', [Validators.required, Validators.min(0)]],
    nightRate: ['', [Validators.required, Validators.min(0)]],
    discounts: this.fb.array([this.createDiscountGroup()]),
  });

  get discounts(): FormArray {
    return this.cityForm.get('discounts') as FormArray;
  }

  createDiscountGroup(
    discount: { duration?: number; discountRate?: number } = {}
  ) {
    return this.fb.group({
      duration: [
        discount.duration || '',
        [Validators.required, Validators.min(1)],
      ],
      discountRate: [
        discount.discountRate || '',
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

    const newCity: INewCity = this.cityForm.value;
    const subscription = this.cityService.addCity(newCity).subscribe({
      next: (createdCity) => {
        this.snackbarService.showMessage('City added successfully', 'success');
        this.dialogRef.close(createdCity);
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
