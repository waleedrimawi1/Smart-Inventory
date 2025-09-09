import { HttpClientModule } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';

// appConfig to provide HttpClientModule
export const appConfig = {
  providers: [
    provideHttpClient(), // Provide HttpClientModule for the app
  ]
};

// Bootstrapping the application
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));