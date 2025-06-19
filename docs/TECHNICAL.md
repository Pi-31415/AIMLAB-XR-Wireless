# Technical Documentation - AIMLAB XR Wireless

## Architecture Overview

The application uses a component-based architecture built on A-Frame, which abstracts WebXR APIs for easier development.

## Key Components

### 1. AR Session Manager
- Handles WebXR session initialization
- Manages AR/VR mode transitions
- Controls passthrough visibility

### 2. Interactive Components
- **interactive-button**: Touch-enabled 3D buttons
- **pinchable**: Hand-tracking grab interactions
- **planet-system**: Animated celestial bodies
- **aimlab-title**: 3D title animation

## WebXR Features Used

- `immersive-ar`: AR session mode
- `hand-tracking`: Hand pose detection
- `dom-overlay`: UI overlay in AR
- `hit-test`: Surface detection (future feature)
- `anchors`: Persistent AR anchors (future feature)

## Performance Considerations

1. **Texture Optimization**: Use compressed textures for better performance
2. **Model Complexity**: Keep polygon counts reasonable
3. **Update Loops**: Minimize per-frame calculations

## Browser Compatibility

- Chrome 79+ (Android)
- Edge 79+ (Windows Mixed Reality)
- Firefox Reality
- Oculus Browser
- Safari (WebXR Viewer app)

## Security Considerations

- HTTPS required for WebXR
- Permissions needed: Camera, Motion sensors
- CORS headers configured for asset loading
