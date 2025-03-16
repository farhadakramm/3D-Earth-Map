import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import { MapComponent } from './app/map/map.component';

const bootstrap = () => bootstrapApplication(MapComponent, config);

export default bootstrap;
