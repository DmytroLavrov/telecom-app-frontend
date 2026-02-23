import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CallService } from '@services/call.service';
import { environment } from '@env/environment';
import { ICall } from '@interfaces/call';

describe('CallService', () => {
  let service: CallService;
  let httpMock: HttpTestingController;

  const BASE_URL = `${environment.apiUrl}/calls`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CallService],
    });

    service = TestBed.inject(CallService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve calls via GET (TC-07)', () => {
    const mockCalls: ICall[] = [
      {
        _id: '1',
        subscriber: 'subscriber1',
        city: 'Kyiv',
        date: Date.now(),
        duration: 120,
        timeOfDay: 'day',
        cost: 10,
      },
    ];

    service.getCalls().subscribe((calls) => {
      expect(calls.length).toBe(1);
      expect(calls).toEqual(mockCalls);
    });

    const req = httpMock.expectOne(BASE_URL);
    expect(req.request.method).toBe('GET');

    req.flush(mockCalls);
  });

  it('should throw a custom error when deleting a call fails (TC-08)', () => {
    service.deleteCall('999').subscribe({
      next: () => fail('The request should have failed'),
      error: (error: Error) => {
        expect(error.message).toBe('An error occurred while deleting the call');
      },
    });

    const req = httpMock.expectOne(`${BASE_URL}/999`);
    expect(req.request.method).toBe('DELETE');

    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
