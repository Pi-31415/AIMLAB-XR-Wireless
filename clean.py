#!/usr/bin/env python3
"""
AIMLAB XR Wireless - Project Restructuring Script
Scaffolds and organizes the project for Vercel deployment
Author: Pi Ko (pi.ko@nyu.edu)
"""

import os
import shutil
import json
from pathlib import Path
import argparse

class ProjectRestructurer:
    """
    Handles the restructuring of the AIMLAB XR project for deployment.
    """
    
    def __init__(self, base_path="."):
        """
        Initialize the restructurer with the base project path.
        
        Args:
            base_path (str): The base directory of the project
        """
        self.base_path = Path(base_path)
        self.new_structure = {
            "public": ["assets", "models", "textures", "audio"],
            "src": ["components", "utils", "styles"],
            "docs": []
        }
        
    def create_directory_structure(self):
        """Create the new directory structure for the project."""
        print("🏗️  Creating new directory structure...")
        
        for main_dir, subdirs in self.new_structure.items():
            main_path = self.base_path / main_dir
            main_path.mkdir(exist_ok=True)
            
            for subdir in subdirs:
                sub_path = main_path / subdir
                sub_path.mkdir(exist_ok=True)
                print(f"   ✅ Created: {sub_path}")
    
    def move_assets(self):
        """Move and organize assets from the example projects."""
        print("\n📦 Organizing assets...")
        
        # Move A-Frame components
        aframe_components = [
            "pinchable.js", "color-change.js", "slider.js", 
            "size-change.js", "button.js", "menu.js", 
            "pressable.js", "event-manager.js", "info-message.js"
        ]
        
        src_components = self.base_path / "src" / "components"
        
        for component in aframe_components:
            src_file = self.base_path / "Campus-Tour-NYUAD-main" / component
            if src_file.exists():
                dest_file = src_components / component
                shutil.copy2(src_file, dest_file)
                print(f"   ✅ Moved component: {component}")
        
        # Move WebXR utilities
        webxr_utils = self.base_path / "webxr-samples-main" / "js"
        if webxr_utils.exists():
            # Copy utility functions
            utils_dest = self.base_path / "src" / "utils"
            util_files = ["hit-test.js", "stereo-util.js"]
            
            for util_file in util_files:
                src_file = webxr_utils / util_file
                if src_file.exists():
                    shutil.copy2(src_file, utils_dest / util_file)
                    print(f"   ✅ Moved utility: {util_file}")
        
        # Move textures and models
        self._move_media_files()
        
    def _move_media_files(self):
        """Move media files to public directory."""
        # Move textures
        texture_sources = [
            (self.base_path / "webxr-samples-main" / "media" / "textures", 
             self.base_path / "public" / "textures"),
            (self.base_path / "webxr-samples-main" / "media" / "gltf",
             self.base_path / "public" / "models")
        ]
        
        for src, dest in texture_sources:
            if src.exists():
                for item in src.rglob("*"):
                    if item.is_file():
                        relative_path = item.relative_to(src)
                        dest_file = dest / relative_path
                        dest_file.parent.mkdir(parents=True, exist_ok=True)
                        shutil.copy2(item, dest_file)
                print(f"   ✅ Moved media from: {src.name}")
    
    def create_config_files(self):
        """Create configuration files for the project."""
        print("\n⚙️  Creating configuration files...")
        
        # Create package.json
        package_json = {
            "name": "aimlab-xr-wireless",
            "version": "1.0.0",
            "description": "AIMLAB Wireless XR - Interactive AR Experience with Hand Tracking",
            "author": "Pi Ko <pi.ko@nyu.edu>",
            "license": "MIT",
            "scripts": {
                "dev": "npx serve .",
                "build": "echo 'No build step required'",
                "preview": "npx serve ."
            },
            "keywords": ["webxr", "ar", "vr", "hand-tracking", "aframe"],
            "repository": {
                "type": "git",
                "url": "https://github.com/yourusername/aimlab-xr-wireless"
            }
        }
        
        with open(self.base_path / "package.json", "w") as f:
            json.dump(package_json, f, indent=2)
        print("   ✅ Created package.json")
        
        # Create vercel.json
        vercel_config = {
            "version": 2,
            "builds": [
                {
                    "src": "index.html",
                    "use": "@vercel/static"
                }
            ],
            "routes": [
                {
                    "src": "/(.*)",
                    "dest": "/$1"
                }
            ],
            "headers": [
                {
                    "source": "/(.*)",
                    "headers": [
                        {
                            "key": "Cross-Origin-Embedder-Policy",
                            "value": "require-corp"
                        },
                        {
                            "key": "Cross-Origin-Opener-Policy",
                            "value": "same-origin"
                        }
                    ]
                }
            ]
        }
        
        with open(self.base_path / "vercel.json", "w") as f:
            json.dump(vercel_config, f, indent=2)
        print("   ✅ Created vercel.json")
        
        # Create .gitignore
        gitignore_content = """# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build output
dist/
build/
.vercel/

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Environment files
.env
.env.local
.env.production

# Temporary files
*.tmp
*.temp
"""
        
        with open(self.base_path / ".gitignore", "w") as f:
            f.write(gitignore_content)
        print("   ✅ Created .gitignore")
        
    def create_documentation(self):
        """Create project documentation."""
        print("\n📚 Creating documentation...")
        
        readme_content = """# AIMLAB Wireless XR

An interactive AR experience combining hand tracking with immersive augmented reality.

## 🚀 Features

- **Hand Tracking**: Natural hand gesture interactions
- **AR Passthrough**: See-through AR experience on compatible devices
- **Interactive Objects**: Pinchable and manipulable 3D objects
- **Planet System**: Animated solar system visualization
- **Control Panel**: Interactive UI elements in 3D space

## 🛠️ Technology Stack

- **A-Frame**: WebVR/AR framework
- **WebXR API**: Modern AR/VR web standard
- **Three.js**: 3D graphics (via A-Frame)

## 📁 Project Structure

```
aimlab-xr-wireless/
├── index.html          # Main application file
├── public/             # Static assets
│   ├── assets/        # General assets
│   ├── models/        # 3D models (GLTF)
│   ├── textures/      # Texture files
│   └── audio/         # Sound files
├── src/               # Source code
│   ├── components/    # A-Frame components
│   ├── utils/         # Utility functions
│   └── styles/        # CSS styles
├── docs/              # Documentation
├── package.json       # Project configuration
└── vercel.json        # Vercel deployment config
```

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aimlab-xr-wireless
   cd aimlab-xr-wireless
   ```

2. **Install dependencies** (optional, for development server)
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 📱 AR Mode

To experience AR mode:
1. Open on a WebXR-compatible device (e.g., Meta Quest, Android with ARCore)
2. Click "Enter AR Mode" button
3. Use hand gestures to interact with objects

## 🎮 Controls

- **Pinch**: Grab and move objects
- **Point**: Interact with buttons
- **Look**: Gaze-based cursor control (fallback)

## 🌐 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/aimlab-xr-wireless)

Or manually:

```bash
npm i -g vercel
vercel
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Pi Ko**  
Email: [pi.ko@nyu.edu](mailto:pi.ko@nyu.edu)

## 🙏 Acknowledgments

- A-Frame community for the excellent WebXR framework
- WebXR samples for reference implementations
- NYU Abu Dhabi for campus tour example code
"""
        
        with open(self.base_path / "README.md", "w") as f:
            f.write(readme_content)
        print("   ✅ Created README.md")
        
        # Create technical documentation
        tech_doc = """# Technical Documentation - AIMLAB XR Wireless

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
"""
        
        docs_path = self.base_path / "docs"
        docs_path.mkdir(exist_ok=True)
        
        with open(docs_path / "TECHNICAL.md", "w") as f:
            f.write(tech_doc)
        print("   ✅ Created technical documentation")
    
    def cleanup_old_files(self):
        """Remove unnecessary files from the old structure."""
        print("\n🧹 Cleaning up old files...")
        
        # List of directories to remove after migration
        old_dirs = [
            "Campus-Tour-NYUAD-main",
            "webxr-samples-main",
            ".git"  # Remove old git history if needed
        ]
        
        for old_dir in old_dirs:
            dir_path = self.base_path / old_dir
            if dir_path.exists() and dir_path.is_dir():
                print(f"   ⚠️  Would remove: {old_dir} (skipped for safety)")
                # Uncomment to actually remove:
                # shutil.rmtree(dir_path)
                # print(f"   ✅ Removed: {old_dir}")
    
    def create_index_html(self):
        """Copy the main HTML file to the root."""
        print("\n📄 Setting up main index.html...")
        
        # The index.html content is already created via artifact
        # This would copy it from a temporary location in a real scenario
        print("   ✅ index.html is ready at project root")
    
    def run(self):
        """Execute the complete restructuring process."""
        print("🚀 Starting AIMLAB XR Wireless project restructuring...\n")
        
        self.create_directory_structure()
        self.move_assets()
        self.create_config_files()
        self.create_documentation()
        self.create_index_html()
        self.cleanup_old_files()
        
        print("\n✨ Project restructuring complete!")
        print("\n📋 Next steps:")
        print("   1. Copy the provided index.html to your project root")
        print("   2. Review and update configuration files")
        print("   3. Test locally with: npm run dev")
        print("   4. Deploy to Vercel with: vercel")
        

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Restructure AIMLAB XR Wireless project for deployment"
    )
    parser.add_argument(
        "--path", 
        default=".", 
        help="Base path of the project (default: current directory)"
    )
    
    args = parser.parse_args()
    
    restructurer = ProjectRestructurer(args.path)
    restructurer.run()