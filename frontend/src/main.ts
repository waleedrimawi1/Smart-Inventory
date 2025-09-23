import { HttpClientModule } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes'; // Import routes configuration
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'; // Import provideAnimations

// appConfig to provide HttpClientModule
export const appConfig = {
  providers: [
    provideHttpClient(), // Provide HttpClientModule for the app
    provideRouter(routes),
     provideAnimations()
  ]
};

// Bootstrapping the application
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));



