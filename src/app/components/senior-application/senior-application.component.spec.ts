import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { SeniorApplicationComponent } from './senior-application.component';
import { FormDataService } from '../../services/form-data.service';

describe('SeniorApplicationComponent', () => {
  let component: SeniorApplicationComponent;
  let fixture: ComponentFixture<SeniorApplicationComponent>;
  let formDataService: FormDataService;
  let router: Router;
  let routerSpy: jasmine.Spy;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        SeniorApplicationComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatDividerModule
      ],
      providers: [
        FormDataService,
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SeniorApplicationComponent);
    component = fixture.componentInstance;
    formDataService = TestBed.inject(FormDataService);
    router = TestBed.inject(Router);
    routerSpy = router.navigate as jasmine.Spy;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should redirect if no form data available', () => {
      formDataService.resetForm();
      
      component.ngOnInit();
      
      expect(routerSpy).toHaveBeenCalledWith(['/']);
    });

    it('should redirect if specialist level is not senior', () => {
      formDataService.updateFormData({
        firstName: 'Jonas',
        specialistLevel: 'junior'
      });
      
      component.ngOnInit();
      
      expect(routerSpy).toHaveBeenCalledWith(['/']);
    });

    it('should not redirect for valid senior data', () => {
      formDataService.updateFormData({
        firstName: 'Jonas',
        lastName: 'Jonaitis',
        email: 'jonas@example.com',
        specialistLevel: 'senior',
        lookingForJob: true
      });
      
      component.ngOnInit();
      
      expect(routerSpy).not.toHaveBeenCalled();
    });
  });

  describe('Looking for Job: True Scenario', () => {
    beforeEach(() => {
      formDataService.updateFormData({
        firstName: 'Jonas',
        lastName: 'Jonaitis',
        email: 'jonas@example.com',
        specialistLevel: 'senior',
        lookingForJob: true
      });
      fixture.detectChanges();
    });

    it('should display success message', () => {
      const successText = fixture.debugElement.nativeElement.textContent;
      expect(successText).toContain('Aplikacija pateikta!');
    });

    it('should display user name in greeting', () => {
      const greetingElement = fixture.debugElement.nativeElement.querySelector('mat-card-subtitle');
      expect(greetingElement?.textContent).toContain('Sveiki, Jonas Jonaitis!');
    });

    it('should display form data as JSON', () => {
      const jsonElement = fixture.debugElement.nativeElement.querySelector('pre');
      expect(jsonElement).toBeTruthy();
      expect(jsonElement?.textContent).toContain('"firstName": "Jonas"');
      expect(jsonElement?.textContent).toContain('"lastName": "Jonaitis"');
    });

    it('should not display motivational letter form', () => {
      const motivationalForm = fixture.debugElement.nativeElement.querySelector('form');
      expect(motivationalForm).toBeFalsy();
    });

    it('should display action buttons', () => {
      const buttons = fixture.debugElement.nativeElement.querySelectorAll('.action-buttons button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Looking for Job: False Scenario', () => {
    beforeEach(() => {
      formDataService.updateFormData({
        firstName: 'Petras',
        lastName: 'Petraitis',
        email: 'petras@example.com',
        specialistLevel: 'senior',
        lookingForJob: false
      });
      fixture.detectChanges();
    });

    it('should display motivational letter form', () => {
      const motivationalForm = fixture.debugElement.nativeElement.querySelector('form');
      expect(motivationalForm).toBeTruthy();
    });

    it('should display info text about motivational letter', () => {
      const infoText = fixture.debugElement.nativeElement.textContent;
      expect(infoText).toContain('nenurodėte, kad ieškote darbo');
    });

    it('should initialize motivational form with minimum 140 characters validation', () => {
      expect(component.motivationalForm).toBeTruthy();
      
      const letterControl = component.motivationalForm.get('motivationalLetter');
      expect(letterControl?.hasError('required')).toBeTruthy();
      
      letterControl?.setValue('Short text');
      expect(letterControl?.hasError('minlength')).toBeTruthy();
    });

    it('should show character count', () => {
      component.motivationalForm.get('motivationalLetter')?.setValue('Test message');
      expect(component.getCharacterCount()).toBe(12);
    });

    it('should not show final result initially', () => {
      expect(component.showFinalResult()).toBeFalsy();
    });
  });

  describe('Motivational Letter Validation', () => {
    beforeEach(() => {
      formDataService.updateFormData({
        firstName: 'Petras',
        lastName: 'Petraitis',
        email: 'petras@example.com',
        specialistLevel: 'senior',
        lookingForJob: false
      });
      fixture.detectChanges();
    });

    it('should require motivational letter', () => {
      const letterControl = component.motivationalForm.get('motivationalLetter');
      expect(letterControl?.hasError('required')).toBeTruthy();
    });

    it('should require minimum 140 characters', () => {
      const letterControl = component.motivationalForm.get('motivationalLetter');
      letterControl?.setValue('Short message'); // Less than 140 characters
      
      expect(letterControl?.hasError('minlength')).toBeTruthy();
    });

    it('should be valid with 140+ characters', () => {
      const letterControl = component.motivationalForm.get('motivationalLetter');
      const longMessage = 'A'.repeat(140);
      letterControl?.setValue(longMessage);
      
      expect(letterControl?.valid).toBeTruthy();
    });

    it('should show validation error messages', () => {
      const letterControl = component.motivationalForm.get('motivationalLetter');
      letterControl?.setValue('');
      letterControl?.markAsTouched();
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('mat-error');
      expect(errorElement?.textContent).toContain('privalomas');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      formDataService.updateFormData({
        firstName: 'Petras',
        lastName: 'Petraitis',
        email: 'petras@example.com',
        specialistLevel: 'senior',
        lookingForJob: false
      });
      fixture.detectChanges();
    });

    it('should submit application with valid motivational letter', (done) => {
      const longMessage = 'A'.repeat(150);
      component.motivationalForm.get('motivationalLetter')?.setValue(longMessage);
      
      spyOn(formDataService, 'updateFormData');
      
      component.submitApplication();
      
      expect(component.isSubmitting()).toBeTruthy();
      expect(formDataService.updateFormData).toHaveBeenCalledWith({
        motivationalLetter: longMessage
      });

      // Wait for async operation to complete
      setTimeout(() => {
        expect(component.applicationSubmitted()).toBeTruthy();
        expect(component.isSubmitting()).toBeFalsy();
        done();
      }, 1100);
    });

    it('should not submit with invalid form', () => {
      spyOn(formDataService, 'updateFormData');
      
      component.motivationalForm.get('motivationalLetter')?.setValue(''); // Invalid
      component.submitApplication();
      
      expect(formDataService.updateFormData).not.toHaveBeenCalled();
      expect(component.isSubmitting()).toBeFalsy();
    });

    it('should show final result after submission', (done) => {
      const longMessage = 'A'.repeat(150);
      component.motivationalForm.get('motivationalLetter')?.setValue(longMessage);
      
      component.submitApplication();
      
      setTimeout(() => {
        expect(component.showFinalResult()).toBeTruthy();
        done();
      }, 1100);
    });
  });

  describe('JSON Data Display', () => {
    beforeEach(() => {
      formDataService.updateFormData({
        firstName: 'Jonas',
        lastName: 'Jonaitis',
        email: 'jonas@example.com',
        specialistLevel: 'senior',
        lookingForJob: true
      });
      fixture.detectChanges();
    });

    it('should return form data as JSON string', () => {
      const jsonString = component.getFormDataJson();
      const parsedData = JSON.parse(jsonString);
      
      expect(parsedData.firstName).toBe('Jonas');
      expect(parsedData.lastName).toBe('Jonaitis');
      expect(parsedData.specialistLevel).toBe('senior');
    });

    it('should return final form data with motivational letter', () => {
      formDataService.updateFormData({ lookingForJob: false });
      component.motivationalForm.get('motivationalLetter')?.setValue('Test motivational letter');
      
      const jsonString = component.getFinalFormDataJson();
      const parsedData = JSON.parse(jsonString);
      
      expect(parsedData.motivationalLetter).toBe('Test motivational letter');
    });
  });

  describe('Navigation Methods', () => {
    beforeEach(() => {
      formDataService.updateFormData({
        firstName: 'Jonas',
        specialistLevel: 'senior'
      });
      fixture.detectChanges();
    });

    it('should navigate back to main form', () => {
      component.goBack();
      expect(routerSpy).toHaveBeenCalledWith(['/']);
    });

    it('should reset form and navigate to start new application', () => {
      spyOn(formDataService, 'resetForm');
      
      component.startNewApplication();
      
      expect(formDataService.resetForm).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith(['/']);
    });
  });

  describe('UI Element Display', () => {
    beforeEach(() => {
      formDataService.updateFormData({
        firstName: 'Jonas',
        lastName: 'Jonaitis',
        specialistLevel: 'senior',
        lookingForJob: true
      });
      fixture.detectChanges();
    });

    it('should display correct title', () => {
      const titleElement = fixture.debugElement.nativeElement.querySelector('mat-card-title');
      expect(titleElement?.textContent).toContain('Senior specialisto paraiška');
    });

    it('should display success icon', () => {
      const successIcon = fixture.debugElement.nativeElement.querySelector('.success-icon');
      expect(successIcon).toBeTruthy();
    });

    it('should display formatted JSON data', () => {
      const preElement = fixture.debugElement.nativeElement.querySelector('pre');
      expect(preElement).toBeTruthy();
      expect(preElement?.textContent).toContain('{');
      expect(preElement?.textContent).toContain('}');
    });
  });

  describe('Computed Signals', () => {
    it('should show final result for non-job-seekers after submission', () => {
      formDataService.updateFormData({
        firstName: 'Jonas',
        specialistLevel: 'senior',
        lookingForJob: false
      });
      
      expect(component.showFinalResult()).toBeFalsy();
      
      component.applicationSubmitted.set(true);
      
      expect(component.showFinalResult()).toBeTruthy();
    });

    it('should not show final result for job seekers', () => {
      formDataService.updateFormData({
        firstName: 'Jonas',
        specialistLevel: 'senior',
        lookingForJob: true
      });
      
      component.applicationSubmitted.set(true);
      
      expect(component.showFinalResult()).toBeFalsy();
    });
  });
});