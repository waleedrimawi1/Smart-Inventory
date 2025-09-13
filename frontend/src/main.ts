import { HttpClientModule } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes'; // Import routes configuration
import { provideRouter } from '@angular/router';

// appConfig to provide HttpClientModule
export const appConfig = {
  providers: [
    provideHttpClient(), // Provide HttpClientModule for the app
    provideRouter(routes),
  ]
};

// Bootstrapping the application
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));



