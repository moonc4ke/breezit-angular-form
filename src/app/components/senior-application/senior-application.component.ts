import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { FormDataService } from '../../services/form-data.service';

@Component({
  selector: 'app-senior-application',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="app-container">
      <mat-card class="app-card app-card--large">
        <mat-card-header>
          <mat-card-title>Senior specialisto paraiška</mat-card-title>
          <mat-card-subtitle>
            Sveiki, {{ formData().firstName }} {{ formData().lastName }}!
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <!-- Case 1: Looking for job = true - show immediate success -->
          <div *ngIf="formData().lookingForJob" class="immediate-success">
            <div class="success-message">
              <mat-icon class="success-icon">check_circle</mat-icon>
              <h2>Aplikacija pateikta!</h2>
              <p>Jūsų paraiška buvo sėkmingai pateikta. Su jumis susisieksime artimiausiu metu.</p>
            </div>
            
            <div class="submitted-data">
              <h3>Visi pateikti duomenys:</h3>
              <pre class="code-block">{{ getFormDataJson() }}</pre>
            </div>
            
            <div class="action-buttons">
              <button mat-button (click)="goBack()">
                <mat-icon>arrow_back</mat-icon>
                Grįžti atgal
              </button>
            </div>
          </div>
          
          <!-- Case 2: Looking for job = false - need motivational letter -->
          <div *ngIf="!formData().lookingForJob && !applicationSubmitted()" class="motivational-section">
            <div class="info-text">
              <p>Kadangi nenurodėte, kad ieškote darbo, prašome parašyti motyvacinio laiško.</p>
            </div>
            
            <form [formGroup]="motivationalForm" (ngSubmit)="submitApplication()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Motyvacinis laiškas</mat-label>
                <textarea 
                  matInput 
                  rows="8" 
                  formControlName="motivationalLetter" 
                  placeholder="Parašykite savo motyvacijos laišką (mažiausiai 140 simbolių)..."
                  required>
                </textarea>
                <mat-hint>{{ getCharacterCount() }}/140 minimum</mat-hint>
                <mat-error *ngIf="motivationalForm.get('motivationalLetter')?.hasError('required')">
                  Motyvacinis laiškas yra privalomas
                </mat-error>
                <mat-error *ngIf="motivationalForm.get('motivationalLetter')?.hasError('minlength')">
                  Motyvacinis laiškas turi būti bent 140 simbolių
                </mat-error>
              </mat-form-field>
              
              <div class="form-actions">
                <button 
                  mat-raised-button 
                  color="primary" 
                  type="submit"
                  [disabled]="!motivationalForm.valid || isSubmitting()">
                  <mat-icon>send</mat-icon>
                  Pateikti aplikaciją
                </button>
                
                <button 
                  mat-button 
                  type="button" 
                  (click)="goBack()">
                  <mat-icon>arrow_back</mat-icon>
                  Grįžti atgal
                </button>
              </div>
            </form>
          </div>
          
          <!-- Case 3: After motivational letter submission -->
          <div *ngIf="!formData().lookingForJob && applicationSubmitted()" class="final-success">
            <div class="success-message">
              <mat-icon class="success-icon">check_circle</mat-icon>
              <h2>Aplikacija pateikta!</h2>
              <p>Ačiū už motyvacijos laišką. Jūsų paraiška buvo sėkmingai pateikta.</p>
            </div>
            
            <div class="submitted-data">
              <h3>Visi pateikti duomenys:</h3>
              <pre class="code-block">{{ getFinalFormDataJson() }}</pre>
            </div>
            
            <div class="action-buttons">
              <button mat-button (click)="goBack()">
                <mat-icon>arrow_back</mat-icon>
                Grįžti atgal
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrl: './senior-application.component.scss'
})
export class SeniorApplicationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private formDataService = inject(FormDataService);
  private snackBar = inject(MatSnackBar);
  motivationalForm!: FormGroup;
  isSubmitting = signal(false);
  applicationSubmitted = signal(false);

  readonly formData = this.formDataService.formData;

  // Computed property to determine when to show final result
  readonly showFinalResult = computed(() => 
    !this.formData().lookingForJob && this.applicationSubmitted()
  );

  ngOnInit(): void {
    if (!this.formData().firstName || this.formData().specialistLevel !== 'senior') {
      this.router.navigate(['/']);
      return;
    }

    if (this.formData().lookingForJob) {
      this.snackBar.open('Jūsų paraiška buvo sėkmingai pateikta!', 'Uždaryti', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
    }

    this.initializeMotivationalForm();
  }

  private initializeMotivationalForm(): void {
    this.motivationalForm = this.fb.group({
      motivationalLetter: [
        this.formData().motivationalLetter || '',
        [Validators.required, Validators.minLength(140)]
      ]
    });
  }

  getCharacterCount(): number {
    return this.motivationalForm?.get('motivationalLetter')?.value?.length || 0;
  }

  getFormDataJson(): string {
    return this.formDataService.getFormDataAsJson();
  }

  getFinalFormDataJson(): string {
    const updatedData = {
      ...this.formData(),
      motivationalLetter: this.motivationalForm.get('motivationalLetter')?.value
    };
    return JSON.stringify(updatedData, null, 2);
  }

  submitApplication(): void {
    if (this.motivationalForm.valid) {
      this.isSubmitting.set(true);
      
      this.formDataService.updateFormData({
        motivationalLetter: this.motivationalForm.get('motivationalLetter')?.value
      });
      
      this.snackBar.open('Aplikacija pateikta!', 'Uždaryti', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
      
      // Simulate submission delay
      setTimeout(() => {
        this.applicationSubmitted.set(true);
        this.isSubmitting.set(false);
      }, 100);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  startNewApplication(): void {
    this.formDataService.resetForm();
    this.router.navigate(['/']);
  }
}