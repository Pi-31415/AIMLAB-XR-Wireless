# AIMLAB XR Wireless - Complete Deployment Guide

**Author: Pi Ko (pi.ko@nyu.edu)**

## 🚀 Quick Deployment to Vercel

### Prerequisites
- Node.js 14+ installed
- Git installed
- Vercel account (free at vercel.com)
- GitHub account (for automatic deployments)

### Option A: Automated Deployment

**The easiest way to get started:**

1. **Make the deployment script executable**:
   ```bash
   chmod +x deploy.sh
   ```

2. **Run the automated deployment**:
   ```bash
   ./deploy.sh
   ```

3. **Follow the prompts** - the script will:
   - Check all prerequisites
   - Restructure your project
   - Create necessary config files
   - Set up local development environment
   - Deploy to Vercel

### Option B: Manual Deployment

1. **Run the restructuring script**:
   ```bash
   python3 restructure_project.py
   ```

2. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

## 🎯 What You Get

### Main Features Implemented

✅ **AR Hand Tracking Experience** (`index.html`)
- Complete WebXR AR application with hand tracking
- Pinch gestures to grab and move objects
- Interactive 3D control panel
- Animated solar system with grabbable planets
- AR passthrough for see-through experience
- Responsive design for mobile and desktop

✅ **Enhanced A-Frame Components** (`src/components/aimlab-components.js`)
- Advanced pinchable component with visual feedback
- Multi-page menu system
- Particle effects for interactions
- Professional documentation and error handling

✅ **Project Structure**
```
aimlab-xr-wireless/
├── index.html              # Main AR application
├── src/
│   ├── components/         # A-Frame components
│   │   ├── aimlab-components.js
│   │   └── [existing components...]
│   ├── utils/             # Utility functions
│   └── styles/            # CSS styles
├── public/                # Static assets
│   ├── assets/
│   ├── models/
│   ├── textures/
│   └── audio/
├── docs/                  # Documentation
├── package.json           # Project configuration
├── vercel.json           # Vercel deployment config
└── README.md             # Project documentation
```

## 🧪 Testing Your Deployment

### Desktop Testing
1. **Start local server**:
   ```bash
   ./start.sh
   # or manually:
   npx serve . --ssl-cert cert.pem --ssl-key key.pem --port 3000
   ```

2. **Open browser**:
   ```bash
   ./test.sh
   # or manually visit: https://localhost:3000
   ```

3. **Test interactions**:
   - Click buttons on the control panel
   - Use mouse to interact with objects
   - Try the "Enter AR Mode" button (may not work on desktop)

### Mobile AR Testing
1. Open on AR-capable Android device with Chrome
2. Navigate to your deployment URL
3. Click "Enter AR Mode"
4. Grant camera permissions
5. Use hand tracking to pinch and grab objects

### VR Testing
1. Open on Meta Quest Browser
2. Navigate to your deployment URL
3. Click "Enter VR" if available
4. Use hand tracking or controllers

## 🛠️ Development Workflow

### Local Development

1. **Start HTTPS server** (required for WebXR):
   ```bash
   ./start.sh
   ```

2. **Make changes** to your files

3. **Refresh browser** to see changes

4. **Test on different devices**:
   - Desktop browser
   - Mobile device
   - VR headset

### Continuous Deployment

The project is configured for automatic deployment:

1. **Make changes** to your code
2. **Commit changes**:
   ```bash
   git add .
   git commit -m "Update XR experience"
   git push
   ```
3. **Deploy updates**:
   ```bash
   vercel --prod
   ```

## 🔧 Configuration Files Created

### `package.json`
- Project metadata and scripts
- Dependencies for development server
- Keywords for discoverability

### `vercel.json`
- Deployment configuration
- CORS headers for WebXR
- Static file serving setup
- Permissions policy for AR features

### Development Scripts
- `start.sh`: Start local HTTPS server
- `test.sh`: Open browser to test app
- `cert.pem` & `key.pem`: Local SSL certificates

## 📊 Features Overview

### Hand Tracking Components

1. **AR Session Manager**
   - Manages AR/VR mode transitions
   - Handles passthrough configuration
   - Adjusts lighting for different modes

2. **Interactive Buttons**
   - 3D buttons with hover effects
   - Hand tracking compatibility
   - Action-based event system

3. **Pinchable Objects**
   - Grab objects with pinch gestures
   - Visual feedback during interaction
   - Opacity changes for grab state

4. **Planet System**
   - Animated solar system
   - Orbital mechanics simulation
   - Interactive planets you can grab

5. **Title Animation**
   - Rotating 3D title
   - Emissive glow effects
   - Subtitle display

### AR Features

- **Passthrough**: See-through AR experience
- **Hand Tracking**: Natural gesture interactions
- **DOM Overlay**: UI elements over AR
- **Device Detection**: Automatic AR button visibility
- **Responsive Design**: Works on mobile and desktop

## 🌐 Accessing Your Deployment

After deployment, Vercel will provide you with:

1. **Production URL**: `https://your-project-name.vercel.app`
2. **Custom Domain** (optional): Configure in Vercel dashboard
3. **Automatic HTTPS**: SSL certificates included
4. **Global CDN**: Fast loading worldwide

## 🚨 Troubleshooting

### Common Issues

1. **"WebXR not supported"**
   - Ensure HTTPS is enabled (automatic on Vercel)
   - Test on supported devices (Android with ARCore, Meta Quest)
   - Check browser compatibility

2. **Hand tracking not working**
   - Ensure good lighting conditions
   - Grant camera permissions when prompted
   - Check device capabilities

3. **Local development issues**
   - Run `./start.sh` to use HTTPS
   - Accept SSL warning in browser
   - Check that certificates exist

### Debug Mode
Add `?debug=true` to your URL to enable debug logging:
```
https://your-deployment.vercel.app/?debug=true
```

## 📈 Next Steps

### Enhancements You Can Add

1. **More Hand Gestures**
   - Implement gesture recognition
   - Add custom gesture handlers

2. **Multiplayer Features**
   - Add WebRTC for collaboration
   - Implement shared experiences

3. **Advanced AR Features**
   - Hit testing for surface placement
   - Persistent anchors
   - Occlusion handling

4. **Analytics**
   - Track user interactions
   - Monitor performance
   - A/B test features

### Resources

- **A-Frame Documentation**: https://aframe.io/docs/
- **WebXR Samples**: https://immersive-web.github.io/webxr-samples/
- **Vercel Documentation**: https://vercel.com/docs

## 🤝 Support

- **Issues**: Report bugs or request features
- **Email**: pi.ko@nyu.edu
- **Documentation**: See README.md for additional details

---

**Happy building with AIMLAB XR! 🎉**

The complete AR hand tracking experience is now ready for deployment and testing across devices. 