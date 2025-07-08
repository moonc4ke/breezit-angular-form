import { Injectable, signal, computed } from '@angular/core';
import { FormData } from '../models/form-data.interface';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formDataSignal = signal<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    lookingForJob: true,
    specialistLevel: '',
    juniorMath: undefined,
    midDescription: undefined,
    motivationalLetter: undefined
  });

  readonly formData = this.formDataSignal.asReadonly();

  readonly isFormValid = computed(() => {
    const data = this.formData();
    const basicFieldsValid = data.firstName.trim() !== '' && 
                            data.lastName.trim() !== '' && 
                            data.email.trim() !== '' &&
                            data.specialistLevel !== '';
    
    if (!basicFieldsValid) return false;

    switch (data.specialistLevel) {
      case 'junior':
        return data.juniorMath === 4;
      case 'mid':
        return data.midDescription?.trim() !== '' && 
               !data.midDescription?.toLowerCase().includes('a');
      case 'senior':
        return true;
      default:
        return false;
    }
  });

  updateFormData(partialData: Partial<FormData>): void {
    this.formDataSignal.update(current => ({
      ...current,
      ...partialData
    }));
  }

  resetForm(): void {
    this.formDataSignal.set({
      firstName: '',
      lastName: '',
      email: '',
      lookingForJob: true,
      specialistLevel: '',
      juniorMath: undefined,
      midDescription: undefined,
      motivationalLetter: undefined
    });
  }

  getFormDataAsJson(): string {
    return JSON.stringify(this.formData(), null, 2);
  }
}