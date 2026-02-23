import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { authInterceptor } from '@interceptors/auth.interceptor';
import { AdminService } from '@services/admin.service';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  let adminServiceMock: any;

  const testUrl = '/api/test-data';

  beforeEach(() => {
    adminServiceMock = {
      token: null,
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AdminService, useValue: adminServiceMock },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add an Authorization header when a token is present in AdminService (TC-20)', () => {
    const fakeToken = 'Bearer valid-jwt-token-123';
    adminServiceMock.token = fakeToken;

    httpClient.get(testUrl).subscribe();

    const req = httpMock.expectOne(testUrl);

    expect(req.request.headers.has('Authorization')).toBeTrue();

    expect(req.request.headers.get('Authorization')).toBe(fakeToken);

    req.flush({});
  });

  it('should NOT add an Authorization header when there is no token (TC-21)', () => {
    adminServiceMock.token = null;

    httpClient.get(testUrl).subscribe();

    const req = httpMock.expectOne(testUrl);

    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({});
  });
});
