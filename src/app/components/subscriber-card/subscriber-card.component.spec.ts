import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriberCardComponent } from '@components/subscriber-card/subscriber-card.component';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { SubscriberService } from '@services/subscriber.service';
import { SnackbarService } from '@services/snackbar.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('SubscriberCardComponent', () => {
  let component: SubscriberCardComponent;
  let fixture: ComponentFixture<SubscriberCardComponent>;

  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let subscriberServiceSpy: jasmine.SpyObj<SubscriberService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;

  const mockSubscriber: any = {
    _id: '507f1f77bcf86cd799439011',
    phoneNumber: '0501112233',
    callsCount: 15,
    edrpou: '12345678',
    address: 'Київ, Хрещатик 1',
  };

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    subscriberServiceSpy = jasmine.createSpyObj('SubscriberService', [
      'deleteSubscriber',
    ]);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', [
      'showMessage',
    ]);

    await TestBed.configureTestingModule({
      imports: [SubscriberCardComponent],
      providers: [
        provideRouter([]),
        { provide: MatDialog, useValue: dialogSpy },
        { provide: SubscriberService, useValue: subscriberServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriberCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('subscriber', mockSubscriber);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render subscriber phone number and ID slice in the template (TC-18)', () => {
    fixture.componentRef.setInput('subscriber', mockSubscriber);
    fixture.detectChanges();

    const phoneElement = fixture.debugElement.query(
      By.css('h3.subscriber-card__phone'),
    ).nativeElement;
    expect(phoneElement.textContent).toContain('+38 (050) 111-22-33');

    const numberElement = fixture.debugElement.query(
      By.css('.subscriber-card__number'),
    ).nativeElement;
    expect(numberElement.textContent).toContain('39011');

    const callsElement = fixture.debugElement.query(
      By.css('.subscriber-card__calls-count'),
    ).nativeElement;
    expect(callsElement.textContent).toContain('Calls: 15');
  });

  it('should process full delete logic and emit subscriberDeleted when delete button is clicked (TC-19)', () => {
    fixture.componentRef.setInput('subscriber', mockSubscriber);
    fixture.detectChanges();

    spyOn(component.subscriberDeleted, 'emit');

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    subscriberServiceSpy.deleteSubscriber.and.returnValue(of(undefined as any));

    const deleteButton = fixture.debugElement.query(
      By.css('button.subscriber-card__btn--delete'),
    );
    deleteButton.triggerEventHandler('click', null);

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(subscriberServiceSpy.deleteSubscriber).toHaveBeenCalledWith(
      mockSubscriber._id,
    );
    expect(snackbarServiceSpy.showMessage).toHaveBeenCalledWith(
      'Subscriber deleted successfully',
      'success',
    );
    expect(component.subscriberDeleted.emit).toHaveBeenCalledWith(
      mockSubscriber._id,
    );
  });
});
