import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from '@guards/auth.guard';
import { AdminService } from '@services/admin.service';

describe('authGuard', () => {
  it('should allow navigation if isAuth is true (TC-16)', () => {
    const mockAdminService = { isAuth: true };
    const mockRouter = { createUrlTree: jasmine.createSpy('createUrlTree') };

    TestBed.configureTestingModule({
      providers: [
        { provide: AdminService, useValue: mockAdminService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const result = TestBed.runInInjectionContext(() => authGuard());

    expect(result).toBeTrue();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('should block navigation and return UrlTree if isAuth is false (TC-17)', () => {
    const fakeUrlTree = {} as UrlTree;
    const mockAdminService = { isAuth: false };
    const mockRouter = {
      createUrlTree: jasmine
        .createSpy('createUrlTree')
        .and.returnValue(fakeUrlTree),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AdminService, useValue: mockAdminService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const result = TestBed.runInInjectionContext(() => authGuard());

    expect(result).toBe(fakeUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
