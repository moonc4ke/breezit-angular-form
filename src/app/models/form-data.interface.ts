export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  lookingForJob: boolean;
  specialistLevel: 'junior' | 'mid' | 'senior' | '';
  juniorMath?: number;
  midDescription?: string;
  motivationalLetter?: string;
}

export type SpecialistLevel = 'junior' | 'mid' | 'senior';