import { TestBed } from '@angular/core/testing';
import { FormDataService } from '../services/form-data.service';
import { FormData } from '../models/form-data.interface';

describe('Form Validation Integration Tests', () => {
  let service: FormDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormDataService);
  });

  describe('Complete Junior Workflow', () => {
    it('should complete junior application successfully', () => {
      // Step 1: Fill basic information
      service.updateFormData({
        firstName: 'Petras',
        lastName: 'Petraitis',
        email: 'petras@example.com',
        lookingForJob: true,
        specialistLevel: 'junior'
      });

      // Step 2: Validate junior math question is required
      expect(service.isFormValid()).toBeFalsy();

      // Step 3: Provide wrong answer
      service.updateFormData({ juniorMath: 5 });
      expect(service.isFormValid()).toBeFalsy();

      // Step 4: Provide correct answer
      service.updateFormData({ juniorMath: 4 });
      expect(service.isFormValid()).toBeTruthy();

      // Step 5: Verify final form data
      const finalData = service.formData();
      expect(finalData.firstName).toBe('Petras');
      expect(finalData.specialistLevel).toBe('junior');
      expect(finalData.juniorMath).toBe(4);
      expect(finalData.lookingForJob).toBe(true);
    });

    it('should reject various wrong answers for math question', () => {
      service.updateFormData({
        firstName: 'Jonas',
        lastName: 'Jonaitis',
        email: 'jonas@example.com',
        specialistLevel: 'junior'
      });

      // Test various wrong answers
      const wrongAnswers = [0, 1, 2, 3, 5, 6, 7, 8];
      
      wrongAnswers.forEach(answer => {
        service.updateFormData({ juniorMath: answer });
        expect(service.isFormValid()).toBeFalsy();
      });

      // Only 4 should be valid
      service.updateFormData({ juniorMath: 4 });
      expect(service.isFormValid()).toBeTruthy();
    });
  });

  describe('Complete Mid Workflow', () => {
    it('should handle mid application workflow', () => {
      // Fill complete valid mid-level form
      service.updateFormData({
        firstName: 'Marija',
        lastName: 'Kazlauskiene',
        email: 'marija@example.com',
        lookingForJob: false,
        specialistLevel: 'mid',
        midDescription: 'Excellent developer with JS skills'
      });

      // Verify final form data structure
      const finalData = service.formData();
      expect(finalData.firstName).toBe('Marija');
      expect(finalData.specialistLevel).toBe('mid');
      expect(finalData.midDescription).toBeDefined();
      expect(finalData.lookingForJob).toBe(false);
      
      // Verify JSON export works
      const jsonData = JSON.parse(service.getFormDataAsJson());
      expect(jsonData.firstName).toBe('Marija');
      expect(jsonData.specialistLevel).toBe('mid');
    });

    it('should validate various descriptions with letter "a"', () => {
      service.updateFormData({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        specialistLevel: 'mid'
      });

      const invalidDescriptions = [
        'Amazing developer',
        'Great at programming', 
        'Has many years of experience',
        'Advanced skills',
        'Professional programmer'
      ];

      invalidDescriptions.forEach(description => {
        service.updateFormData({ midDescription: description });
        expect(service.isFormValid()).toBeFalsy();
      });

      const validDescriptions = [
        'Excellent JS coder',
        'Skilled in JS tech',
        'Frontend expert',
        'Full-steck engineer',
        'Senior JS guru'
      ];

      validDescriptions.forEach(description => {
        service.updateFormData({ midDescription: description });
        expect(service.isFormValid()).toBeTruthy();
      });
    });
  });

  describe('Complete Senior Workflow', () => {
    it('should complete senior application when looking for job', () => {
      // Step 1: Fill basic information
      service.updateFormData({
        firstName: 'Tomas',
        lastName: 'Tomauskas',
        email: 'tomas@example.com',
        lookingForJob: true,
        specialistLevel: 'senior'
      });

      // Step 2: Verify form is valid for senior
      expect(service.isFormValid()).toBeTruthy();

      // Step 3: Verify form data is complete
      const formData = service.formData();
      expect(formData.firstName).toBe('Tomas');
      expect(formData.lookingForJob).toBe(true);
      expect(formData.specialistLevel).toBe('senior');

      // Step 4: Verify JSON export contains all data
      const jsonData = JSON.parse(service.getFormDataAsJson());
      expect(jsonData.firstName).toBe('Tomas');
      expect(jsonData.lastName).toBe('Tomauskas');
      expect(jsonData.email).toBe('tomas@example.com');
      expect(jsonData.lookingForJob).toBe(true);
      expect(jsonData.specialistLevel).toBe('senior');
    });

    it('should handle senior application with motivational letter', () => {
      // Step 1: Fill basic information (not looking for job)
      service.updateFormData({
        firstName: 'Ona',
        lastName: 'Onaite',
        email: 'ona@example.com',
        lookingForJob: false,
        specialistLevel: 'senior'
      });

      // Step 2: Verify form is valid even without motivational letter for senior
      expect(service.isFormValid()).toBeTruthy();

      // Step 3: Add motivational letter
      const motivationalLetter = 'This is my motivational letter explaining why I would be e greet fit for your compeny. '.repeat(2);
      
      service.updateFormData({
        motivationalLetter: motivationalLetter
      });

      // Step 4: Verify complete form data
      const formData = service.formData();
      expect(formData.firstName).toBe('Ona');
      expect(formData.lookingForJob).toBe(false);
      expect(formData.motivationalLetter).toBe(motivationalLetter);
      expect(formData.motivationalLetter!.length).toBeGreaterThan(140);

      // Step 5: Verify JSON export includes motivational letter
      const jsonData = JSON.parse(service.getFormDataAsJson());
      expect(jsonData.motivationalLetter).toBe(motivationalLetter);
      expect(jsonData.lookingForJob).toBe(false);
    });
  });

  describe('Form Reset and Data Persistence', () => {
    it('should reset all form data correctly', () => {
      // Fill form with all possible data
      service.updateFormData({
        firstName: 'Full',
        lastName: 'Data',
        email: 'full@example.com',
        lookingForJob: false,
        specialistLevel: 'senior',
        juniorMath: 4,
        midDescription: 'Some description',
        motivationalLetter: 'Some motivational letter'
      });

      // Verify data is set
      let formData = service.formData();
      expect(formData.firstName).toBe('Full');
      expect(formData.juniorMath).toBe(4);
      expect(formData.midDescription).toBe('Some description');

      // Reset form
      service.resetForm();

      // Verify all data is reset
      formData = service.formData();
      expect(formData.firstName).toBe('');
      expect(formData.lastName).toBe('');
      expect(formData.email).toBe('');
      expect(formData.lookingForJob).toBe(true); // Default value
      expect(formData.specialistLevel).toBe('');
      expect(formData.juniorMath).toBeUndefined();
      expect(formData.midDescription).toBeUndefined();
      expect(formData.motivationalLetter).toBeUndefined();
    });

    it('should handle partial form completion', () => {
      // Only basic fields filled
      service.updateFormData({
        firstName: 'Partial',
        lastName: 'User',
        email: 'partial@example.com'
      });

      // Should be invalid without specialist level
      expect(service.isFormValid()).toBeFalsy();

      // Add specialist level
      service.updateFormData({ specialistLevel: 'senior' });
      
      // Should now be valid for senior
      expect(service.isFormValid()).toBeTruthy();
    });

    it('should preserve data during updates', () => {
      // Fill form data
      service.updateFormData({
        firstName: 'Persistent',
        lastName: 'User',
        email: 'persistent@example.com',
        specialistLevel: 'senior',
        lookingForJob: true
      });

      // Update only one field
      service.updateFormData({
        lookingForJob: false
      });

      // Other data should still be there
      const formData = service.formData();
      expect(formData.firstName).toBe('Persistent');
      expect(formData.email).toBe('persistent@example.com');
      expect(formData.specialistLevel).toBe('senior');
      expect(formData.lookingForJob).toBe(false); // Updated field
    });
  });
});