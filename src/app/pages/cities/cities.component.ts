import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CityService } from '@services/city.service';
import { ICity } from '@interfaces/city';
import { CityCardComponent } from '@components/city-card/city-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { AddCityComponent } from '@components/add-city/add-city.component';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [CityCardComponent, MatProgressSpinnerModule],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss',
})
export class CitiesComponent {
  private destroyRef = inject(DestroyRef);
  private cityService = inject(CityService);
  private dialog = inject(MatDialog);

  cities = signal<ICity[]>([]);
  isLoading = signal(true);
  searchTerm = signal<string>('');

  filteredCities = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    return this.cities().filter(
      (s) =>
        s._id.toLowerCase().includes(term) ||
        s.name.toLowerCase().includes(term),
    );
  });

  ngOnInit() {
    const subscription = this.cityService.getCities().subscribe({
      next: (data) => {
        this.cities.set(data);
        console.log(data);
      },
      complete: () => {
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        console.error('Error loading cities:', err.message);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  openAddCityDialog() {
    const buttonElement = document.activeElement as HTMLElement;
    if (buttonElement) {
      buttonElement.blur();
    }

    const dialogRef = this.dialog.open(AddCityComponent, {
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cities.set([...this.cities(), result]);
      }
    });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onCityDeleted(id: string) {
    this.cities.set(this.cities().filter((s) => s._id !== id));
  }

  onCityUpdated(updatedCity: ICity) {
    this.cities.set(
      this.cities().map((s) =>
        s._id === updatedCity._id ? { ...s, ...updatedCity } : s,
      ),
    );
  }
}
