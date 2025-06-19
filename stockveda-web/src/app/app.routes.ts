import { Routes } from '@angular/router';
import { Chat } from './chat/chat';

export const routes: Routes = [
    { path: '', component: Chat },
    { path: 'privacy', loadComponent: () => import('./privacy/privacy').then(m => m.Privacy) },
    { path: 'terms', loadComponent: () => import('./terms/terms').then(m => m.Terms) }
];
