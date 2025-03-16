// Importing necessary modules and libraries from Angular and Three.js
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Utility to check if the platform is a browser
import * as THREE from 'three'; // Import Three.js core library
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Import OrbitControls for camera manipulation

// Component metadata
@Component({
  selector: 'app-map',  // The selector for this component
  standalone: true, // Indicates this component is standalone (no need to import it in other modules)
  templateUrl: './map.component.html',  // Path to the HTML template
  styleUrls: ['./map.component.scss']  // Path to the component's styles (CSS or SCSS)
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('globeCanvas', { static: true }) private canvasRef!: ElementRef; // Reference to the canvas element in the template
  private globe: any; // Variable to store the globe mesh (3D object)
  private scene!: THREE.Scene; // The scene where all 3D objects will be added
  private camera!: THREE.PerspectiveCamera; // Camera for rendering the 3D scene
  private renderer!: THREE.WebGLRenderer; // Renderer for drawing the 3D scene onto the canvas
  private controls!: OrbitControls; // Controls for interacting with the camera (e.g., panning, zooming)
  private animationFrameId!: number; // Variable to store the ID of the animation frame

  // Constructor with platform ID injection to check the platform (e.g., browser, server)
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // ngOnInit lifecycle hook, called when the component is initialized
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {  // Check if the platform is a browser
      // Initialize the scene, camera, and renderer if running in the browser
      this.scene = new THREE.Scene();  // Create a new scene
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Set up the camera
      this.camera.position.z = 3;  // Position the camera along the z-axis

      // Create a WebGLRenderer with the canvas from the template
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement });
      this.renderer.setSize(window.innerWidth, window.innerHeight);  // Set the renderer size to the window size
      this.renderer.setClearColor(0xffffff, 1);  // Set background color of the canvas (white)

      // Set the background color of the scene
      this.scene.background = new THREE.Color(0xffffff); // White background for the scene

      // Call the method to create the globe
      this.createGlobe();
    }
  }

  // ngAfterViewInit lifecycle hook, called after the view is initialized
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {  // Ensure we're in the browser
      // Set up the OrbitControls for camera manipulation
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // Optional control settings (commented out)
      // this.controls.enableDamping = true;      // Enable damping (smooth transition)
      // this.controls.dampingFactor = 0.25;      // Set damping factor (adjusts the smoothness)
      // this.controls.screenSpacePanning = false; // Disable panning in screen space

      // Start the animation loop
      this.animate();

      // Add event listener to handle window resizing
      window.addEventListener('resize', this.onResize.bind(this));  // Bind 'this' context for the resize method
    }
  }

  // ngOnDestroy lifecycle hook, called when the component is destroyed
  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {  // Ensure we're in the browser
      // Cancel any ongoing animation frame when the component is destroyed
      cancelAnimationFrame(this.animationFrameId);
      // Remove the resize event listener to prevent memory leaks
      window.removeEventListener('resize', this.onResize.bind(this));
    }
  }

  // Method to create the globe
  private createGlobe(): void {
    if (isPlatformBrowser(this.platformId)) {  // Ensure we're in the browser
      // Load the Earth texture using TextureLoader
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-day.jpg');  // Texture for the globe

      // Create a sphere geometry for the globe (radius = 1, width and height segments = 32)
      const geometry = new THREE.SphereGeometry(1, 32, 32);

      // Create a basic material and apply the texture to it
      const material = new THREE.MeshBasicMaterial({
        map: texture,  // Apply the texture to the material
        // overdraw: 0.5 // Uncomment if you want to enable overdraw (for alpha blending effects)
      });

      // Create the globe mesh (3D object) using the geometry and material
      this.globe = new THREE.Mesh(geometry, material);
      // Add the globe to the scene
      this.scene.add(this.globe);
    }
  }

  // Animation loop to continuously render the scene
  private animate(): void {
    // Request the next animation frame
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Update the camera controls (e.g., rotation, zoom)
    if (this.controls) {
      this.controls.update();  // Update the controls during the animation loop
    }

    // Rotate the globe to animate it (you can adjust rotation speed here)
    this.globe.rotation.x += 0.000;  // No rotation on the x-axis (currently no animation)
    this.globe.rotation.y += 0.000;  // No rotation on the y-axis (currently no animation)

    // Render the scene using the camera
    this.renderer.render(this.scene, this.camera);
  }

  // Method to handle window resizing
  private onResize(): void {
    if (isPlatformBrowser(this.platformId)) {  // Ensure we're in the browser
      // Update camera aspect ratio based on window size
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.aspect = width / height;  // Adjust the camera's aspect ratio
      this.camera.updateProjectionMatrix();  // Update the camera's projection matrix
      this.renderer.setSize(width, height);  // Resize the renderer to match the new window size
    }
  }
}
