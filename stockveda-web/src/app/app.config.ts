import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAJKYmPibg-eHjOAv6gkRmlZSq8eilcOP4",
  authDomain: "stockveda-23d6c.firebaseapp.com",
  projectId: "stockveda-23d6c",
  storageBucket: "stockveda-23d6c.firebasestorage.app",
  messagingSenderId: "793633866156",
  appId: "1:793633866156:web:371114d43e2610fbeffa09",
  measurementId: "G-LRCV6ZN26D"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
