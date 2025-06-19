#!/bin/bash

# AIMLAB XR Wireless - Automated Deployment Script
# Author: Pi Ko (pi.ko@nyu.edu)
# This script automates the entire deployment process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "    _    ___ __  __ _      _    ____   __  ______  "
echo "   / \  |_ _|  \/  | |    / \  | __ )  \ \/ /  _ \ "
echo "  / _ \  | || |\/| | |   / _ \ |  _ \   \  /| |_) |"
echo " / ___ \ | || |  | | |__/ ___ \| |_) |  /  \|  _ < "
echo "/_/   \_\___|_|  |_|____/_/   \_\____/  /_/\_\_| \_\\"
echo ""
echo "         Wireless XR Deployment Script v1.0"
echo -e "${NC}"

# Function to print colored messages
print_status() {
    echo -e "${BLUE}[*]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 14+"
        exit 1
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git"
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3"
        exit 1
    fi
    
    print_success "All prerequisites met!"
}

# Run project restructuring
restructure_project() {
    print_status "Restructuring project..."
    
    if [ -f "restructure_project.py" ]; then
        python3 restructure_project.py
        print_success "Project restructured successfully!"
    else
        print_warning "restructure_project.py not found, skipping restructure"
    fi
}

# Initialize Git repository
init_git() {
    print_status "Initializing Git repository..."
    
    if [ ! -d ".git" ]; then
        git init
        print_success "Git repository initialized"
    else
        print_warning "Git repository already exists"
    fi
    
    # Add all files
    git add .
    git commit -m "AIMLAB XR: Complete implementation with hand tracking and AR" || print_warning "Nothing to commit"
}

# Install Vercel CLI
install_vercel() {
    print_status "Checking Vercel CLI..."
    
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm i -g vercel
        print_success "Vercel CLI installed"
    else
        print_success "Vercel CLI already installed"
    fi
}

# Create local HTTPS certificates
create_certificates() {
    print_status "Creating local HTTPS certificates..."
    
    if [ ! -f "cert.pem" ] || [ ! -f "key.pem" ]; then
        openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 \
            -keyout key.pem -out cert.pem \
            -subj "/C=US/ST=State/L=City/O=AIMLAB/CN=localhost"
        print_success "HTTPS certificates created"
    else
        print_warning "Certificates already exist"
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if already logged in
    if ! vercel whoami &> /dev/null; then
        print_warning "Not logged in to Vercel"
        print_status "Please log in:"
        vercel login
    fi
    
    # Deploy
    print_status "Starting deployment..."
    vercel --prod
    
    print_success "Deployment complete!"
}

# Create development scripts
create_dev_scripts() {
    print_status "Creating development scripts..."
    
    # Create start script
    cat > start.sh << 'EOL'
#!/bin/bash
echo "Starting AIMLAB XR development server..."
npx serve . --ssl-cert cert.pem --ssl-key key.pem --port 3000
EOL
    chmod +x start.sh
    
    # Create test script
    cat > test.sh << 'EOL'
#!/bin/bash
echo "Opening AIMLAB XR in browser..."
if command -v open &> /dev/null; then
    open https://localhost:3000
elif command -v xdg-open &> /dev/null; then
    xdg-open https://localhost:3000
else
    echo "Please open https://localhost:3000 in your browser"
fi
EOL
    chmod +x test.sh
    
    print_success "Development scripts created"
}

# Main deployment flow
main() {
    echo ""
    print_status "Starting AIMLAB XR deployment process..."
    echo ""
    
    # Run all steps
    check_prerequisites
    restructure_project
    init_git
    install_vercel
    create_certificates
    create_dev_scripts
    
    echo ""
    print_success "Setup complete! 🎉"
    echo ""
    
    # Ask if user wants to deploy now
    read -p "Do you want to deploy to Vercel now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_to_vercel
    else
        print_status "You can deploy later by running: vercel --prod"
    fi
    
    echo ""
    print_success "All done! Your AIMLAB XR project is ready."
    echo ""
    echo "Next steps:"
    echo "  1. Test locally: ./start.sh"
    echo "  2. Open browser: ./test.sh"
    echo "  3. Deploy updates: git push && vercel --prod"
    echo ""
    echo "Happy building! 🚀"
}

# Run main function
main

# Exit successfully
exit 0 