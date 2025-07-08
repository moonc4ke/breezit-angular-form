import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/dynamic-form/dynamic-form.component').then(m => m.DynamicFormComponent),
    title: 'Aplikacijos forma'
  },
  {
    path: 'senior-application',
    loadComponent: () => import('./components/senior-application/senior-application.component').then(m => m.SeniorApplicationComponent),
    title: 'Senior paraiška'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
