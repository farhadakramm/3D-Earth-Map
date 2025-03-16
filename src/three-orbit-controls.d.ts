// Declare a module for OrbitControls, which is part of the Three.js library, for handling camera manipulation.
declare module 'three/examples/jsm/controls/OrbitControls' {
  
  // Import necessary classes from the 'three' library for type definitions
  import { Camera, EventDispatcher, MOUSE, Vector2 } from 'three'; // Camera, EventDispatcher, MOUSE enum, and Vector2

  // Define the OrbitControls class, extending from EventDispatcher (which is a class that can emit events)
  export class OrbitControls extends EventDispatcher {
    
    // Constructor that takes a camera object (to control) and an HTML DOM element (for user interaction)
    constructor(camera: Camera, domElement: HTMLElement);

    // A boolean flag to enable or disable the controls (default is true)
    enabled: boolean;

    // The target that the camera is focused on (usually the center of the scene)
    target: Vector3;

    // The minimum distance the camera can zoom in
    minDistance: number;

    // The maximum distance the camera can zoom out
    maxDistance: number;

    // The maximum angle (in radians) the camera can rotate vertically (around the x-axis)
    maxPolarAngle: number;

    // A method to update the control's state (typically called every frame in the animation loop)
    update(): void;

    // A method to clean up the controls (e.g., removing event listeners or other cleanup)
    dispose(): void;

    // A method to listen for key events (e.g., keyboard inputs for controlling the camera)
    listenToKeyEvents(domElement: HTMLElement): void;

    // A method to rotate the camera around the target in the left direction (angle is in radians)
    rotateLeft(angle: number): void;

    // A method to rotate the camera around the target in the upward direction (angle is in radians)
    rotateUp(angle: number): void;

    // A method to zoom in the camera by a specified zoom scale
    zoomIn(zoomScale: number): void;

    // A method to zoom out the camera by a specified zoom scale
    zoomOut(zoomScale: number): void;
  }

  // Declare a constant object 'MOUSE' to represent different mouse buttons
  export const MOUSE: {
    LEFT: number;   // Left mouse button
    MIDDLE: number; // Middle (wheel) mouse button
    RIGHT: number;  // Right mouse button
  };

  // Declare a constant object 'TOUCH' to represent different touch event states
  export const TOUCH: {
    ONE: number;  // Single touch (one finger)
    TWO: number;  // Dual touch (two fingers)
    THREE: number; // Triple touch (three fingers)
  };
}
