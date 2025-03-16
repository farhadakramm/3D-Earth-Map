import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { MapComponent } from './app/map/map.component';
import { CountryDetailsComponent } from './app/country-details/country-details.component';
import { routes } from './app/app.routes';

bootstrapApplication(MapComponent, appConfig)
  .catch((err) => console.error(err));
