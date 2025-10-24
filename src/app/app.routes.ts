import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'test',
    pathMatch: 'full'
  },
  {
    path: 'test',
    loadComponent: () => import('./components/test/test.component').then(m => m.TestComponent)
  },
  {
    path: 'result',
    loadComponent: () => import('./components/result/result.component').then(m => m.ResultComponent)
  }
];
