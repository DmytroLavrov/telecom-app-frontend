import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SubscriberService } from '@services/subscriber.service';
import {
  ISubscriberCard,
  INewSubscriber,
  ISubscriberDetails,
} from '@interfaces/subscriber';
import { environment } from '@env/environment';

describe('SubscriberService', () => {
  let service: SubscriberService;
  let httpMock: HttpTestingController;

  const BASE_URL = `${environment.apiUrl}/subscribers`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SubscriberService],
    });

    service = TestBed.inject(SubscriberService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve subscribers via GET (TC-05)', () => {
    const mockSubscribers: ISubscriberCard[] = [
      {
        _id: '1',
        phoneNumber: '0501234567',
        edrpou: '12345678',
        address: 'Kyiv',
        callsCount: 5,
      },
      {
        _id: '2',
        phoneNumber: '0671234567',
        edrpou: '87654321',
        address: 'Lviv',
        callsCount: 2,
      },
    ];

    service.getSubscribers().subscribe((subscribers) => {
      expect(subscribers.length).toBe(2);
      expect(subscribers).toEqual(mockSubscribers);
    });

    const req = httpMock.expectOne(BASE_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockSubscribers);
  });

  it('should add a subscriber via POST (TC-06)', () => {
    const newSubscriber: INewSubscriber = {
      phoneNumber: '0631112233',
      edrpou: '11223344',
      address: 'Odesa',
    };

    const createdSubscriber: ISubscriberCard = {
      _id: '3',
      phoneNumber: '0631112233',
      edrpou: '11223344',
      address: 'Kyiv',
      callsCount: 0,
    };

    service.addSubscriber(newSubscriber).subscribe((subscriber) => {
      expect(subscriber).toEqual(createdSubscriber);
    });

    const req = httpMock.expectOne(BASE_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSubscriber);

    req.flush(createdSubscriber);
  });

  it('should retrieve subscriber details via GET (TC-07)', () => {
    const mockDetails: ISubscriberDetails = {
      subscriber: {
        _id: '1',
        phoneNumber: '0501234567',
        edrpou: '12345678',
        address: 'Kyiv',
        callsCount: 5,
      },
      calls: [
        {
          _id: 'call1',
          city: 'Kyiv',
          duration: 120,
          timeOfDay: 'day',
          cost: 10,
          date: '2025-01-01',
        },
      ],
    };

    service.getSubscriberDetails('1').subscribe((details) => {
      expect(details).toEqual(mockDetails);
    });

    const req = httpMock.expectOne(`${BASE_URL}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDetails);
  });
});
