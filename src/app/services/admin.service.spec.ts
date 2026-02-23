import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AdminService } from '@services/admin.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { IAdminLogin, ITokenResponse } from '@interfaces/admin';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;
  let cookieService: jasmine.SpyObj<CookieService>;
  let router: jasmine.SpyObj<Router>;

  const authUrl = `${environment.apiUrl}/auth/login`;

  beforeEach(() => {
    const cookieSpy = jasmine.createSpyObj('CookieService', [
      'set',
      'delete',
      'get',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AdminService,
        { provide: CookieService, useValue: cookieSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
    cookieService = TestBed.inject(
      CookieService,
    ) as jasmine.SpyObj<CookieService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request and save token to cookie on successful login (TC-13)', () => {
    const mockCredentials: IAdminLogin = {
      email: 'admin@example.com',
      password: 'password123',
    };
    const mockResponse: ITokenResponse = { token: 'fake-jwt-token-12345' };

    service.login(mockCredentials).subscribe((response) => {
      expect(response.token).toBe('fake-jwt-token-12345');
    });

    const req = httpMock.expectOne(authUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);

    req.flush(mockResponse);

    expect(cookieService.set).toHaveBeenCalledWith(
      'Token',
      'fake-jwt-token-12345',
    );
  });

  it('should NOT save token if login fails with 401 (TC-14)', () => {
    const mockCredentials: IAdminLogin = {
      email: 'admin@example.com',
      password: 'wrong-password',
    };

    service.login(mockCredentials).subscribe({
      next: () => fail('The request should have failed'),
      error: (error) => {
        expect(error.status).toBe(401);
      },
    });

    const req = httpMock.expectOne(authUrl);
    expect(req.request.method).toBe('POST');

    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(cookieService.set).not.toHaveBeenCalled();
  });

  it('should remove token from cookie on logout and navigate to /login (TC-15)', () => {
    service.logout();

    expect(service.token).toBeNull();
    expect(cookieService.delete).toHaveBeenCalledWith('Token');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
