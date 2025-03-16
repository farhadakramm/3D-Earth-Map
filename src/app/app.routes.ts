import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { CountryDetailsComponent } from './country-details/country-details.component';

export const routes: Routes = [
    { path: '', component: MapComponent }, // Set MapComponent as the default route
    { path: 'map', component: MapComponent },
    { path: 'country-details', component: CountryDetailsComponent }
];
