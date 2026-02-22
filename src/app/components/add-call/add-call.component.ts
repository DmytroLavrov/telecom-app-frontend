import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CallService } from '@services/call.service';
import { SubscriberService } from '@services/subscriber.service';
import { CityService } from '@services/city.service';
import { INewCall } from '@interfaces/call';
import { ISubscriber } from '@interfaces/subscriber';
import { ICity } from '@interfaces/city';
import { SnackbarService } from '@services/snackbar.service';
import { PhoneNumberFormatPipe } from '@pipes/phone-number-format.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-add-call',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    PhoneNumberFormatPipe,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ScrollingModule,
  ],
  templateUrl: './add-call.component.html',
  styleUrls: ['./add-call.component.scss'],
})
export class AddCallComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddCallComponent>);
  private callService = inject(CallService);
  private subscriberService = inject(SubscriberService);
  private cityService = inject(CityService);
  private snackbarService = inject(SnackbarService);
  private destroyRef = inject(DestroyRef);

  subscribers = signal<ISubscriber[]>([]);
  cities = signal<ICity[]>([]);

  filteredSubscribers = signal<ISubscriber[]>([]);
  filteredCities = signal<ICity[]>([]);

  callForm: FormGroup = this.fb.group({
    subscriber: [null, Validators.required],
    city: [null, Validators.required],
    startDate: ['', Validators.required],
    startHour: [
      '',
      [Validators.required, Validators.min(0), Validators.max(23)],
    ],
    startMinute: [
      '',
      [Validators.required, Validators.min(0), Validators.max(59)],
    ],
    startSecond: [
      '',
      [Validators.required, Validators.min(0), Validators.max(59)],
    ],
    endDate: ['', Validators.required],
    endHour: ['', [Validators.required, Validators.min(0), Validators.max(23)]],
    endMinute: [
      '',
      [Validators.required, Validators.min(0), Validators.max(59)],
    ],
    endSecond: [
      '',
      [Validators.required, Validators.min(0), Validators.max(59)],
    ],
  });

  ngOnInit() {
    this.loadSubscribers();
    this.loadCities();
    this.setupFormListeners();
  }

  private loadSubscribers() {
    this.subscriberService
      .getSubscribers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.subscribers.set(data);
        this.filteredSubscribers.set(data);
      });
  }

  private loadCities() {
    this.cityService
      .getCities()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.cities.set(data);
        this.filteredCities.set(data);
      });
  }

  private setupFormListeners() {
    this.callForm
      .get('subscriber')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (typeof value === 'string') {
          this.filteredSubscribers.set(
            this.subscribers().filter((subscriber) =>
              subscriber.phoneNumber
                .toLowerCase()
                .includes(value.toLowerCase()),
            ),
          );
        }
      });

    this.callForm
      .get('city')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (typeof value === 'string') {
          this.filteredCities.set(
            this.cities().filter((city) =>
              city.name.toLowerCase().includes(value.toLowerCase()),
            ),
          );
        }
      });
  }

  validateTimeInput(event: Event, max: number) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (!/^\d*$/.test(value)) {
      target.value = value.slice(0, -1);
      return;
    }

    const numericValue = Number(value);

    if (numericValue > max) {
      target.value = value.slice(0, -1);
    }
  }

  formatTime(event: Event) {
    const target = event.target as HTMLInputElement;
    let value = target.value.trim();

    if (value !== '' && Number(value) < 10) {
      target.value = `0${Number(value)}`;
    }
  }

  displayFn(subscriber: ISubscriber): string {
    return subscriber ? subscriber.phoneNumber : '';
  }

  displayFnCity(city: ICity): string {
    return city ? city.name : '';
  }

  private calculateDuration(): number {
    const {
      startDate,
      startHour,
      startMinute,
      startSecond,
      endDate,
      endHour,
      endMinute,
      endSecond,
    } = this.callForm.value;

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (startDateObj > endDateObj) {
      this.snackbarService.showMessage(
        'Start date must be earlier than end date!',
        'error',
      );
      throw new Error('Start date must be earlier than end date!');
    }

    if (startDate === endDate) {
      const startTimeInSeconds =
        startHour * 3600 + startMinute * 60 + startSecond;
      const endTimeInSeconds = endHour * 3600 + endMinute * 60 + endSecond;

      if (startTimeInSeconds >= endTimeInSeconds) {
        this.snackbarService.showMessage(
          'Start time must be earlier than end time on the same date!',
          'error',
        );
        throw new Error(
          'Start time must be earlier than end time on the same date!',
        );
      }
    }

    const startDateTime = new Date(
      `${startDate}T${[startHour, startMinute, startSecond]
        .map((n) => String(n).padStart(2, '0'))
        .join(':')}`,
    );

    const endDateTime = new Date(
      `${endDate}T${[endHour, endMinute, endSecond]
        .map((n) => String(n).padStart(2, '0'))
        .join(':')}`,
    );

    return (endDateTime.getTime() - startDateTime.getTime()) / 1000;
  }

  onSubmit() {
    if (this.callForm.invalid) {
      this.callForm.markAllAsTouched();
      return;
    }

    const formValue = this.callForm.value;

    const newCall: INewCall = {
      subscriber: formValue.subscriber._id,
      city: formValue.city._id,
      date: `${formValue.startDate}T${[
        formValue.startHour,
        formValue.startMinute,
        formValue.startSecond,
      ]
        .map((n) => String(n).padStart(2, '0'))
        .join(':')}`,
      duration: this.calculateDuration(),
    };

    const subscription = this.callService.addCall(newCall).subscribe({
      next: (result) => {
        this.dialogRef.close(result);
        this.snackbarService.showMessage(
          'Call created successfully!',
          'success',
        );
      },
      error: (err) => {
        console.error('Error creating call:', err);
        this.snackbarService.showMessage(
          'Failed to create call. Please try again.',
          'error',
        );
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  close() {
    this.dialogRef.close();
  }
}
