import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    ...appConfig.providers, // This already includes provideRouter from app.config
    provideHttpClient(), 
  ]
})
  .catch((err) => console.error(err));
