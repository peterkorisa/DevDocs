import { Routes } from '@angular/router';
import { Main } from './main/main';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'article/:id', component: Main },
      { path: '', component: Main }
    ]
  }
];
