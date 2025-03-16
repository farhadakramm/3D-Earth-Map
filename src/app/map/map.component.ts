import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-map', // Component selector
  standalone: true, // Mark this as a standalone component
  template: `<div #cesiumContainer class="cesium-container"></div>`, // HTML template with a container div for Cesium
  styles: [`
    .cesium-container { // CSS style for the Cesium container
      width: 100vw; // Full width of the viewport
      height: 100vh; // Full height of the viewport
      position: fixed; // Fixed positioning
      top: 0; // Position at the top of the screen
      left: 0; // Position at the left of the screen
    }
  `]
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cesiumContainer', { static: true }) container!: ElementRef; // ViewChild to access the container element in the template
  private viewer!: any; // Cesium viewer object
  private Cesium: any; // Reference to the Cesium global object
  private resizeHandler!: () => void; // Handler for resize event
  isCesiumLoaded = false; // Flag to check if Cesium is loaded

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {} // Constructor that injects the platform ID

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) { // Check if running in the browser (not server-side rendering)
      try {
        // Load Cesium from CDN
        await this.loadCesiumFromCDN();
        this.isCesiumLoaded = true; // Set flag to true after loading
      } catch (error) {
        console.error('Failed to load Cesium:', error); // Log error if Cesium fails to load
      }
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) { // Check if running in the browser
      // Wait for Cesium to load by checking the isCesiumLoaded flag
      while (!this.isCesiumLoaded) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms before checking again
      }
  
      try {
        // Initialize Cesium after loading
        await this.initCesium();
      } catch (error) {
        console.error('Cesium initialization failed:', error); // Log error if Cesium initialization fails
      }
    }
  }

  private async loadCesiumFromCDN(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create a new script element to load the Cesium.js file from CDN
      const script = document.createElement('script');
      script.src = 'https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Cesium.js'; // Cesium script URL
      script.onload = () => {
        // Check if Cesium is available in the global window object
        if ((window as any).Cesium) {
          console.log('Cesium script loaded:', (window as any).Cesium); // Log Cesium if successfully loaded
          console.log('Cesium version:', (window as any).Cesium.VERSION); // Log the Cesium version
  
          // Verify that createWorldTerrainAsync is available in the Cesium object
          if (!(window as any).Cesium.createWorldTerrain) {
            reject(new Error('createWorldTerrainAsync is not available in the Cesium object.')); // Reject if not available
            return;
          }
  
          // Create a link element to load the Cesium CSS file
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Widgets/widgets.css'; // Cesium CSS URL
          document.head.appendChild(link); // Append the link to the head of the document
          resolve(); // Resolve the promise when CSS is loaded
        } else {
          reject(new Error('Cesium is not available in the global scope.')); // Reject if Cesium is not available
        }
      };
      script.onerror = () => reject(new Error('Failed to load Cesium script.')); // Reject if there is an error loading the script
      document.head.appendChild(script); // Append the script to the head of the document
    });
  }

  private async initCesium(): Promise<void> {
    this.Cesium = (window as any).Cesium; // Get the Cesium object from the global window object
    if (!this.Cesium) {
      console.error('Cesium is not loaded.'); // Log an error if Cesium is not loaded
      return;
    }
  
    try {
      console.log('Initializing Cesium Viewer...');
  
      // Verify container element for the Cesium viewer
      const container = this.container.nativeElement;
      if (!container) {
        console.error('Container element not found.'); // Log an error if the container element is not found
        return;
      }
      console.log('Container element:', container); // Log the container element
      console.log('Container size:', container.offsetWidth, 'x', container.offsetHeight); // Log the container size
  
      // Log Cesium version
      console.log('Cesium version:', this.Cesium.VERSION);
  
      // Set Cesium Ion token for access
      this.Cesium.Ion.defaultAccessToken = 'YOUR_CESIUM_TOKEN_HERE'; // Replace with your Cesium Ion token
      console.log('Cesium Ion token set:', this.Cesium.Ion.defaultAccessToken);
  
      // Preload required assets (approximate terrain heights and IAU data)
      console.log('Loading approximateTerrainHeights.json...');
      await this.Cesium.Resource.fetchJson('https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Assets/approximateTerrainHeights.json')
        .then(() => console.log('approximateTerrainHeights.json loaded successfully')) // Log success
        .catch((error: any) => console.error('Failed to load approximateTerrainHeights.json:', error)); // Log error if fails
  
      console.log('Loading IAU2006_XYS_18.json...');
      await this.Cesium.Resource.fetchJson('https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Assets/IAU2006_XYS/IAU2006_XYS_18.json')
        .then(() => console.log('IAU2006_XYS_18.json loaded successfully')) // Log success
        .catch((error: any) => console.error('Failed to load IAU2006_XYS_18.json:', error)); // Log error if fails
  
      // Create World Terrain provider (synchronous)
      console.log('Creating World Terrain...');
      const terrainProvider = this.Cesium.createWorldTerrain(); // Create terrain provider
      console.log('World Terrain created successfully:', terrainProvider); // Log the terrain provider
  
      // Initialize Cesium Viewer with various options
      console.log('Initializing Cesium Viewer...');
      this.viewer = new this.Cesium.Viewer(container, {
        animation: true, // Enable animation widget
        baseLayerPicker: true, // Enable base layer picker
        fullscreenButton: true, // Enable fullscreen button
        geocoder: true, // Enable geocoder (search bar)
        homeButton: true, // Enable home button
        infoBox: true, // Enable info box
        sceneModePicker: true, // Enable scene mode picker
        selectionIndicator: true, // Enable selection indicator
        timeline: true, // Enable timeline
        navigationHelpButton: true, // Enable navigation help button
        imageryProvider: new this.Cesium.OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/' // Set OpenStreetMap imagery provider
        }),
        terrainProvider: terrainProvider // Set terrain provider
      });
  
      console.log('Cesium Viewer initialized:', this.viewer);
  
      // Set initial camera view for the map
      console.log('Setting initial camera view...');
      this.viewer.camera.setView({
        destination: this.Cesium.Cartesian3.fromDegrees(0, 0, 10000000), // Set the camera destination (Longitude, Latitude, Height)
        orientation: {
          heading: 0, // Heading to East
          pitch: -Math.PI / 2, // Looking straight down (Pitch)
          roll: 0 // No roll
        }
      });
      console.log('Camera view set successfully.');
  
      // Add resize handler for responsiveness
      this.resizeHandler = () => this.viewer.resize(); // Resize the viewer on window resize
      window.addEventListener('resize', this.resizeHandler); // Attach the resize event handler
      console.log('Resize handler added.');
  
    } catch (error) {
      console.error('Cesium initialization error:', error); // Log any errors during initialization
      throw error; // Rethrow the error if initialization fails
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.viewer && !this.viewer.isDestroyed()) {
      // Clean up when the component is destroyed
      window.removeEventListener('resize', this.resizeHandler); // Remove resize handler
      this.viewer.destroy(); // Destroy the Cesium viewer to free resources
    }
  }
}
