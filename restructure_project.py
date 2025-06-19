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
    Creates proper directory structure, moves assets, and generates config files.
    """
    
    def __init__(self, base_path="."):
        """Initialize the restructurer with the base project path."""
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
        
        # Move WebXR utilities if they exist
        webxr_utils = self.base_path / "webxr-samples-main" / "js"
        if webxr_utils.exists():
            utils_dest = self.base_path / "src" / "utils"
            util_files = ["hit-test.js", "stereo-util.js"]
            
            for util_file in util_files:
                src_file = webxr_utils / util_file
                if src_file.exists():
                    shutil.copy2(src_file, utils_dest / util_file)
                    print(f"   ✅ Moved utility: {util_file}")
        
        # Move media files
        self._move_media_files()
        
    def _move_media_files(self):
        """Move media files to public directory."""
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
        print("   ✅ Updated package.json")
        
        # Update vercel.json with proper headers
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
                        },
                        {
                            "key": "Permissions-Policy",
                            "value": "xr-spatial-tracking=(self)"
                        }
                    ]
                }
            ]
        }
        
        with open(self.base_path / "vercel.json", "w") as f:
            json.dump(vercel_config, f, indent=2)
        print("   ✅ Updated vercel.json")
        
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

## 🚀 Quick Start

1. **Run development server**
   ```bash
   npm run dev
   ```

2. **Open in browser**
   Navigate to `http://localhost:3000`

## 📱 AR Mode

To experience AR mode:
1. Open on a WebXR-compatible device
2. Click "Enter AR Mode" button
3. Use hand gestures to interact with objects

## 🌐 Deployment

Deploy to Vercel:
```bash
npm i -g vercel
vercel
```

## 👨‍💻 Author

**Pi Ko**  
Email: [pi.ko@nyu.edu](mailto:pi.ko@nyu.edu)
"""
        
        with open(self.base_path / "README.md", "w") as f:
            f.write(readme_content)
        print("   ✅ Updated README.md")
        
    def run(self):
        """Execute the complete restructuring process."""
        print("🚀 Starting AIMLAB XR Wireless project restructuring...\n")
        
        self.create_directory_structure()
        self.move_assets()
        self.create_config_files()
        self.create_documentation()
        
        print("\n✨ Project restructuring complete!")
        print("\n📋 Next steps:")
        print("   1. Test locally with: npm run dev")
        print("   2. Deploy to Vercel with: vercel")
        

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