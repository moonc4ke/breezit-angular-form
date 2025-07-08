import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FormDataService } from '../../services/form-data.service';
import { SpecialistLevel } from '../../models/form-data.interface';

@Component({
  selector: 'app-dynamic-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="app-container">
      <mat-card class="app-card app-card--small">
        <mat-card-header>
          <mat-card-title>Aplikacijos forma</mat-card-title>
          <mat-card-subtitle>Užpildykite informaciją apie save</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="applicationForm" (ngSubmit)="onSubmit()">
            <!-- Basic fields -->
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Vardas</mat-label>
                <input matInput formControlName="firstName" required>
                <mat-error *ngIf="applicationForm.get('firstName')?.hasError('required')">
                  Vardas yra privalomas
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Pavardė</mat-label>
                <input matInput formControlName="lastName" required>
                <mat-error *ngIf="applicationForm.get('lastName')?.hasError('required')">
                  Pavardė yra privaloma
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>El. paštas</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-error *ngIf="applicationForm.get('email')?.hasError('required')">
                El. paštas yra privalomas
              </mat-error>
              <mat-error *ngIf="applicationForm.get('email')?.hasError('email')">
                Įveskite teisingą el. pašto adresą
              </mat-error>
            </mat-form-field>

            <div class="checkbox-field">
              <mat-checkbox formControlName="lookingForJob">
                Ar ieškote darbo?
              </mat-checkbox>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Kokio lygio specialistas esate?</mat-label>
              <mat-select formControlName="specialistLevel" required (selectionChange)="onSpecialistLevelChange($event.value)">
                <mat-option value="junior">Junior</mat-option>
                <mat-option value="mid">Mid</mat-option>
                <mat-option value="senior">Senior</mat-option>
              </mat-select>
              <mat-error *ngIf="applicationForm.get('specialistLevel')?.hasError('required')">
                Pasirinkite savo lygį
              </mat-error>
            </mat-form-field>

            <!-- Dynamic fields based on specialist level -->
            <!-- Junior level field -->
            @if (currentSpecialistLevel() === 'junior') {
              <div class="dynamic-field">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Kiek yra 2+2?</mat-label>
                  <input matInput type="number" formControlName="juniorMath" required>
                  <mat-error *ngIf="applicationForm.get('juniorMath')?.hasError('required')">
                    Atsakymas yra privalomas
                  </mat-error>
                  <mat-error *ngIf="applicationForm.get('juniorMath')?.hasError('incorrect')">
                    Neteisingas atsakymas.
                  </mat-error>
                </mat-form-field>
              </div>
            }

            <!-- Mid level field -->
            @if (currentSpecialistLevel() === 'mid') {
              <div class="dynamic-field describe-yourself-field">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Aprašykite save</mat-label>
                  <textarea matInput rows="4" formControlName="midDescription" required 
                           placeholder="Aprašykite save (negalite naudoti raidės 'a')"></textarea>
                  <mat-error *ngIf="applicationForm.get('midDescription')?.hasError('required')">
                    Aprašymas yra privalomas
                  </mat-error>
                  <mat-error *ngIf="applicationForm.get('midDescription')?.hasError('containsLetterA')">
                    Aprašyme negali būti raidės 'a'
                  </mat-error>
                </mat-form-field>
              </div>
            }

            <div class="form-actions">
              <button 
                mat-raised-button 
                color="primary" 
                type="submit"
                [disabled]="!applicationForm.valid || isSubmitting()">
                <mat-icon>send</mat-icon>
                {{ getSubmitButtonText() }}
              </button>
              
              <button 
                mat-button 
                type="button" 
                (click)="resetForm()"
                [disabled]="isSubmitting()">
                <mat-icon>refresh</mat-icon>
                Išvalyti
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private formDataService = inject(FormDataService);
  private snackBar = inject(MatSnackBar);

  applicationForm!: FormGroup;
  isSubmitting = signal(false);
  currentSpecialistLevel = signal<string>('');

  ngOnInit(): void {
    this.initializeForm();
    this.setupDynamicValidation();
  }

  private initializeForm(): void {
    const formData = this.formDataService.formData();
    
    this.applicationForm = this.fb.group({
      firstName: [formData.firstName, [Validators.required]],
      lastName: [formData.lastName, [Validators.required]],
      email: [formData.email, [Validators.required, Validators.email]],
      lookingForJob: [formData.lookingForJob],
      specialistLevel: [formData.specialistLevel, [Validators.required]],
      juniorMath: [formData.juniorMath],
      midDescription: [formData.midDescription]
    });

    this.currentSpecialistLevel.set(formData.specialistLevel);
  }

  onSpecialistLevelChange(level: SpecialistLevel): void {
    this.currentSpecialistLevel.set(level);
    this.clearDynamicValidators();
    
    switch (level) {
      case 'junior':
        this.applicationForm.get('juniorMath')?.setValidators([Validators.required, this.correctAnswerValidator]);
        break;
      case 'mid':
        this.applicationForm.get('midDescription')?.setValidators([
          Validators.required,
          this.noLetterAValidator
        ]);
        break;
      case 'senior':
        break;
    }
    
    this.applicationForm.get('juniorMath')?.updateValueAndValidity();
    this.applicationForm.get('midDescription')?.updateValueAndValidity();
  }

  private setupDynamicValidation(): void {
    this.applicationForm.get('specialistLevel')?.valueChanges.subscribe((level: SpecialistLevel) => {
      this.onSpecialistLevelChange(level);
    });
  }

  private clearDynamicValidators(): void {
    this.applicationForm.get('juniorMath')?.clearValidators();
    this.applicationForm.get('midDescription')?.clearValidators();
    this.applicationForm.get('juniorMath')?.setValue(null);
    this.applicationForm.get('midDescription')?.setValue('');
  }

  private correctAnswerValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value !== null && value !== 4 ? { incorrect: true } : null;
  }

  private noLetterAValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.toLowerCase() || '';
    return value.includes('a') ? { containsLetterA: true } : null;
  }

  getSubmitButtonText(): string {
    const level = this.currentSpecialistLevel();
    return level === 'senior' ? 'Pereiti prie paraiškos' : 'Pateikti';
  }

  onSubmit(): void {
    if (this.applicationForm.valid) {
      this.isSubmitting.set(true);
      
      this.formDataService.updateFormData(this.applicationForm.value);
      
      const level = this.applicationForm.get('specialistLevel')?.value;
      
      if (level === 'senior') {
        this.router.navigate(['/senior-application']);
      } else {
        this.snackBar.open('Paraiška sėkmingai pateikta!', 'Uždaryti', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      }
      
      this.isSubmitting.set(false);
    }
  }

  resetForm(): void {
    this.formDataService.resetForm();
    this.initializeForm();
  }
}