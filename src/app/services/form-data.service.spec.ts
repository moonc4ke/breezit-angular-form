import { TestBed } from '@angular/core/testing';
import { FormDataService } from './form-data.service';
import { FormData } from '../models/form-data.interface';

describe('FormDataService', () => {
  let service: FormDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should have correct initial form data', () => {
      const initialData = service.formData();
      
      expect(initialData.firstName).toBe('');
      expect(initialData.lastName).toBe('');
      expect(initialData.email).toBe('');
      expect(initialData.lookingForJob).toBe(true);
      expect(initialData.specialistLevel).toBe('');
      expect(initialData.juniorMath).toBeUndefined();
      expect(initialData.midDescription).toBeUndefined();
      expect(initialData.motivationalLetter).toBeUndefined();
    });

    it('should initially be invalid', () => {
      expect(service.isFormValid()).toBeFalsy();
    });
  });

  describe('Form Data Updates', () => {
    it('should update form data correctly', () => {
      const updateData: Partial<FormData> = {
        firstName: 'Jonas',
        lastName: 'Jonaitis',
        email: 'jonas@example.com'
      };

      service.updateFormData(updateData);
      const formData = service.formData();

      expect(formData.firstName).toBe('Jonas');
      expect(formData.lastName).toBe('Jonaitis');
      expect(formData.email).toBe('jonas@example.com');
      expect(formData.lookingForJob).toBe(true); // Should remain unchanged
    });

    it('should preserve existing data when updating partially', () => {
      service.updateFormData({
        firstName: 'Petras',
        specialistLevel: 'junior'
      });

      service.updateFormData({
        lastName: 'Petraitis'
      });

      const formData = service.formData();
      expect(formData.firstName).toBe('Petras');
      expect(formData.lastName).toBe('Petraitis');
      expect(formData.specialistLevel).toBe('junior');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      // Set basic required fields
      service.updateFormData({
        firstName: 'Jonas',
        lastName: 'Jonaitis',
        email: 'jonas@example.com'
      });
    });

    it('should be invalid without specialist level', () => {
      expect(service.isFormValid()).toBeFalsy();
    });

    describe('Junior Level Validation', () => {
      beforeEach(() => {
        service.updateFormData({ specialistLevel: 'junior' });
      });

      it('should be valid when juniorMath is 4', () => {
        service.updateFormData({ juniorMath: 4 });
        expect(service.isFormValid()).toBeTruthy();
      });

      it('should be invalid when juniorMath is not 4', () => {
        service.updateFormData({ juniorMath: 5 });
        expect(service.isFormValid()).toBeFalsy();
      });

      it('should be invalid when juniorMath is undefined', () => {
        expect(service.isFormValid()).toBeFalsy();
      });
    });

    describe('Mid Level Validation', () => {
      beforeEach(() => {
        service.updateFormData({ specialistLevel: 'mid' });
      });

      it('should be valid with description without letter "a"', () => {
        service.updateFormData({ midDescription: 'Esu puikus JS koderi su didele pirtimi' });
        expect(service.isFormValid()).toBeTruthy();
      });

      it('should be invalid with description containing letter "a"', () => {
        service.updateFormData({ midDescription: 'Esu patyrės programuotojas' });
        expect(service.isFormValid()).toBeFalsy();
      });

      it('should be invalid with empty description', () => {
        service.updateFormData({ midDescription: '' });
        expect(service.isFormValid()).toBeFalsy();
      });

      it('should be invalid with description containing uppercase "A"', () => {
        service.updateFormData({ midDescription: 'Aš esu programuotojs' });
        expect(service.isFormValid()).toBeFalsy();
      });
    });

    describe('Senior Level Validation', () => {
      it('should be valid for senior level without additional fields', () => {
        service.updateFormData({ specialistLevel: 'senior' });
        expect(service.isFormValid()).toBeTruthy();
      });
    });
  });

  describe('Form Reset', () => {
    it('should reset form to initial state', () => {
      service.updateFormData({
        firstName: 'Jonas',
        lastName: 'Jonaitis',
        email: 'jonas@example.com',
        specialistLevel: 'senior',
        juniorMath: 4,
        midDescription: 'Some description',
        motivationalLetter: 'Some motivation'
      });

      service.resetForm();
      const formData = service.formData();

      expect(formData.firstName).toBe('');
      expect(formData.lastName).toBe('');
      expect(formData.email).toBe('');
      expect(formData.lookingForJob).toBe(true);
      expect(formData.specialistLevel).toBe('');
      expect(formData.juniorMath).toBeUndefined();
      expect(formData.midDescription).toBeUndefined();
      expect(formData.motivationalLetter).toBeUndefined();
    });
  });

  describe('JSON Export', () => {
    it('should return form data as formatted JSON string', () => {
      const testData: Partial<FormData> = {
        firstName: 'Jonas',
        lastName: 'Jonaitis',
        email: 'jonas@example.com',
        specialistLevel: 'senior',
        lookingForJob: false
      };

      service.updateFormData(testData);
      const jsonString = service.getFormDataAsJson();
      const parsedData = JSON.parse(jsonString);

      expect(parsedData.firstName).toBe('Jonas');
      expect(parsedData.lastName).toBe('Jonaitis');
      expect(parsedData.email).toBe('jonas@example.com');
      expect(parsedData.specialistLevel).toBe('senior');
      expect(parsedData.lookingForJob).toBe(false);
    });

    it('should format JSON with proper indentation', () => {
      service.updateFormData({ firstName: 'Test' });
      const jsonString = service.getFormDataAsJson();
      
      expect(jsonString).toContain('{\n');
      expect(jsonString).toContain('  "firstName": "Test"');
    });
  });
});