import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CityService } from '@services/city.service';
import { ICity, INewCity } from '@interfaces/city';
import { environment } from '@env/environment';

describe('CityService', () => {
  let service: CityService;
  let httpMock: HttpTestingController;

  const BASE_URL = `${environment.apiUrl}/cities`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CityService],
    });
    service = TestBed.inject(CityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Check for open requests
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve cities via GET (TC-03)', () => {
    const mockCities: ICity[] = [
      {
        _id: '1',
        name: 'Київ',
        dayRate: 10,
        nightRate: 15,
        discounts: [],
      },
      {
        _id: '2',
        name: 'Львів',
        dayRate: 12,
        nightRate: 18,
        discounts: [],
      },
    ];

    service.getCities().subscribe((cities) => {
      expect(cities.length).toBe(2);
      expect(cities).toEqual(mockCities);
    });

    const req = httpMock.expectOne(BASE_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockCities); // Simulate the server response
  });

  it('should handle error when adding a city (TC-04)', () => {
    const newCity: INewCity = {
      name: 'Тест',
      dayRate: 10,
      nightRate: 15,
      discounts: [],
    };

    service.addCity(newCity).subscribe({
      next: () => fail('The request should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(BASE_URL);

    expect(req.request.method).toBe('POST');

    // Simulate a server error
    req.flush('Failed to add city', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });
});
