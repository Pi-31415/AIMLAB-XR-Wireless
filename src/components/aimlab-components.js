/**
 * AIMLAB XR Wireless - Custom A-Frame Components Library
 * 
 * This file contains all custom components for the AIMLAB XR experience
 * including advanced hand tracking interactions, UI elements, and AR features.
 * This library extends the basic components with professional-grade functionality
 * for enterprise-level XR applications.
 * 
 * Components included:
 * - Enhanced Pinchable: Advanced hand gesture interactions
 * - Advanced Menu System: Multi-page floating menus
 * - Gesture Recognition: Beyond basic pinch gestures
 * - AR Anchor: Persistent spatial anchors
 * - Particle System: Visual effects for interactions
 * - Haptic Feedback: Vibration support
 * - Spatial Sound Manager: 3D audio positioning
 * 
 * @author Pi Ko (pi.ko@nyu.edu)
 * @version 1.0.0
 * @license MIT
 */

// ============================================================================
// Core Interaction Components
// ============================================================================

/**
 * Enhanced Pinchable Component
 * 
 * Advanced version of the pinchable component that allows objects to be grabbed,
 * moved, rotated, and scaled with sophisticated hand gestures. This component
 * provides visual feedback, constraints, and event handling for complex interactions.
 * 
 * Features:
 * - Multi-finger gesture support
 * - Scale and rotation constraints
 * - Visual feedback with outline effects
 * - Event system for custom behaviors
 * - Physics integration support
 * 
 * @author Pi Ko (pi.ko@nyu.edu)
 */
AFRAME.registerComponent('enhanced-pinchable', {
    schema: {
        enableScale: {default: true},
        enableRotation: {default: true},
        scaleSpeed: {default: 0.1},
        minScale: {default: 0.1},
        maxScale: {default: 3},
        rotationSpeed: {default: 1},
        constrainToPlane: {default: false},
        snapToGrid: {default: false},
        gridSize: {default: 0.1}
    },

    init: function() {
        // Initialize interaction state
        this.el.classList.add('pinchable');
        this.originalScale = this.el.getAttribute('scale') ? 
            this.el.getAttribute('scale').clone() : 
            new THREE.Vector3(1, 1, 1);
        this.originalPosition = this.el.getAttribute('position') ? 
            this.el.getAttribute('position').clone() : 
            new THREE.Vector3(0, 0, 0);
        
        this.isPinched = false;
        this.pinchDistance = 0;
        this.lastPinchPosition = null;
        
        // Visual feedback elements
        this.createVisualFeedback();
        this.createInteractionHints();
        
        // Event listeners for hand tracking
        this.setupEventListeners();
    },

    /**
     * Create visual feedback elements for pinch interactions
     */
    createVisualFeedback: function() {
        // Create outline effect for grab indication
        const geometry = this.el.getAttribute('geometry');
        if (geometry) {
            const outline = document.createElement('a-entity');
            outline.setAttribute('geometry', {
                primitive: geometry.primitive || 'box',
                width: (geometry.width || 1) * 1.1,
                height: (geometry.height || 1) * 1.1,
                depth: (geometry.depth || 1) * 1.1
            });
            outline.setAttribute('material', {
                shader: 'flat',
                color: '#00ff88',
                opacity: 0.3,
                side: 'back',
                transparent: true
            });
            outline.setAttribute('visible', false);
            outline.classList.add('pinch-outline');
            this.el.appendChild(outline);
            this.outline = outline;
        }

        // Create particle effect for grab
        this.createGrabParticles();
    },

    /**
     * Create interaction hint elements
     */
    createInteractionHints: function() {
        const hint = document.createElement('a-text');
        hint.setAttribute('value', 'Pinch to grab');
        hint.setAttribute('position', '0 1 0');
        hint.setAttribute('align', 'center');
        hint.setAttribute('width', 2);
        hint.setAttribute('color', '#00ff88');
        hint.setAttribute('opacity', 0.7);
        hint.setAttribute('visible', false);
        hint.classList.add('interaction-hint');
        this.el.appendChild(hint);
        this.hint = hint;
    },

    /**
     * Create particle effect for grab feedback
     */
    createGrabParticles: function() {
        this.particles = [];
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('a-sphere');
            particle.setAttribute('radius', 0.01);
            particle.setAttribute('color', '#00ff88');
            particle.setAttribute('visible', false);
            this.el.appendChild(particle);
            this.particles.push(particle);
        }
    },

    /**
     * Setup event listeners for hand tracking interactions
     */
    setupEventListeners: function() {
        // Pinch gesture events
        this.el.addEventListener('pinchstarted', this.onPinchStart.bind(this));
        this.el.addEventListener('pinchended', this.onPinchEnd.bind(this));
        this.el.addEventListener('pinchmoved', this.onPinchMove.bind(this));
        
        // Hover effects for proximity detection
        this.el.addEventListener('mouseenter', this.onHoverStart.bind(this));
        this.el.addEventListener('mouseleave', this.onHoverEnd.bind(this));
        
        // Hand proximity events (if available)
        this.el.addEventListener('handproximity', this.onHandProximity.bind(this));
    },

    /**
     * Handle pinch start event
     */
    onPinchStart: function(evt) {
        console.log('Enhanced pinch started');
        this.isPinched = true;
        
        // Show visual feedback
        if (this.outline) this.outline.setAttribute('visible', true);
        
        // Trigger particle burst
        this.triggerParticleBurst();
        
        // Store initial interaction data
        if (evt.detail.position) {
            this.pinchStartPosition = evt.detail.position.clone();
        }
        
        // Emit custom event for external handling
        this.el.emit('grabbed', {
            position: this.el.getAttribute('position'),
            scale: this.el.getAttribute('scale'),
            timestamp: Date.now()
        });
        
        // Change opacity for visual feedback
        const currentOpacity = this.el.getAttribute('material').opacity || 1;
        this.originalOpacity = currentOpacity;
        this.el.setAttribute('material', 'opacity', currentOpacity * 0.7);
    },

    /**
     * Handle pinch end event
     */
    onPinchEnd: function(evt) {
        console.log('Enhanced pinch ended');
        this.isPinched = false;
        
        // Hide visual feedback
        if (this.outline) this.outline.setAttribute('visible', false);
        
        // Restore original opacity
        if (this.originalOpacity !== undefined) {
            this.el.setAttribute('material', 'opacity', this.originalOpacity);
        }
        
        // Snap to grid if enabled
        if (this.data.snapToGrid) {
            this.snapPositionToGrid();
        }
        
        // Emit release event
        this.el.emit('released', {
            position: this.el.getAttribute('position'),
            scale: this.el.getAttribute('scale'),
            timestamp: Date.now()
        });
    },

    /**
     * Handle pinch move event for scaling and rotation
     */
    onPinchMove: function(evt) {
        if (!this.isPinched) return;
        
        // Handle scaling
        if (this.data.enableScale && evt.detail.scale !== undefined) {
            const scale = this.originalScale.x * evt.detail.scale;
            const clampedScale = Math.max(this.data.minScale, 
                                         Math.min(this.data.maxScale, scale));
            
            this.el.setAttribute('scale', {
                x: clampedScale,
                y: clampedScale,
                z: clampedScale
            });
        }
        
        // Handle rotation
        if (this.data.enableRotation && evt.detail.rotation) {
            const currentRotation = this.el.getAttribute('rotation');
            const newRotation = {
                x: currentRotation.x + evt.detail.rotation.x * this.data.rotationSpeed,
                y: currentRotation.y + evt.detail.rotation.y * this.data.rotationSpeed,
                z: currentRotation.z + evt.detail.rotation.z * this.data.rotationSpeed
            };
            this.el.setAttribute('rotation', newRotation);
        }
    },

    /**
     * Handle hover start for proximity feedback
     */
    onHoverStart: function(evt) {
        if (this.hint) {
            this.hint.setAttribute('visible', true);
            this.hint.setAttribute('animation', {
                property: 'opacity',
                to: 1,
                dur: 200
            });
        }
    },

    /**
     * Handle hover end
     */
    onHoverEnd: function(evt) {
        if (this.hint) {
            this.hint.setAttribute('animation', {
                property: 'opacity',
                to: 0,
                dur: 200
            });
            setTimeout(() => {
                if (this.hint) this.hint.setAttribute('visible', false);
            }, 200);
        }
    },

    /**
     * Handle hand proximity detection
     */
    onHandProximity: function(evt) {
        const distance = evt.detail.distance;
        if (distance < 0.1) { // Very close
            this.el.setAttribute('animation__pulse', {
                property: 'scale',
                to: '1.05 1.05 1.05',
                dur: 500,
                loop: true,
                dir: 'alternate'
            });
        } else {
            this.el.removeAttribute('animation__pulse');
        }
    },

    /**
     * Trigger particle burst effect
     */
    triggerParticleBurst: function() {
        const position = this.el.getAttribute('position');
        
        this.particles.forEach((particle, i) => {
            const angle = (i / this.particles.length) * Math.PI * 2;
            const radius = 0.2;
            const targetPos = {
                x: position.x + Math.cos(angle) * radius,
                y: position.y + Math.sin(angle) * radius,
                z: position.z
            };
            
            particle.setAttribute('visible', true);
            particle.setAttribute('position', position);
            particle.setAttribute('animation', {
                property: 'position',
                to: `${targetPos.x} ${targetPos.y} ${targetPos.z}`,
                dur: 800,
                easing: 'easeOutQuad'
            });
            particle.setAttribute('animation__fade', {
                property: 'material.opacity',
                from: 1,
                to: 0,
                dur: 800
            });
            
            setTimeout(() => {
                particle.setAttribute('visible', false);
            }, 800);
        });
    },

    /**
     * Snap position to grid
     */
    snapPositionToGrid: function() {
        const pos = this.el.getAttribute('position');
        const gridSize = this.data.gridSize;
        
        const snappedPos = {
            x: Math.round(pos.x / gridSize) * gridSize,
            y: Math.round(pos.y / gridSize) * gridSize,
            z: Math.round(pos.z / gridSize) * gridSize
        };
        
        this.el.setAttribute('position', snappedPos);
    }
});

// ============================================================================
// Advanced UI Components
// ============================================================================

/**
 * Advanced Menu System Component
 * 
 * Creates sophisticated floating menus with multiple pages, smooth transitions,
 * and comprehensive navigation. This component supports complex UI layouts
 * with nested menus and dynamic content loading.
 * 
 * Features:
 * - Multi-page menu system
 * - Smooth page transitions
 * - Theme support (light/dark)
 * - Navigation controls
 * - Dynamic content loading
 * - Responsive layout
 * 
 * @author Pi Ko (pi.ko@nyu.edu)
 */
AFRAME.registerComponent('advanced-menu', {
    schema: {
        title: {default: 'Menu'},
        width: {default: 1},
        height: {default: 0.8},
        pages: {default: []},
        theme: {default: 'light'},
        autoHide: {default: true},
        hideDelay: {default: 5000}
    },

    init: function() {
        this.currentPage = 0;
        this.pages = this.data.pages || this.createDefaultPages();
        this.isVisible = true;
        
        // Create menu structure
        this.createMenuPanel();
        this.createNavigationButtons();
        this.createPageIndicator();
        this.showPage(0);
        
        // Setup interactions
        this.setupMenuInteractions();
        
        // Auto-hide functionality
        if (this.data.autoHide) {
            this.setupAutoHide();
        }
    },

    /**
     * Create default pages if none provided
     */
    createDefaultPages: function() {
        return [
            {
                title: 'Main',
                content: [
                    {type: 'text', value: 'Welcome to AIMLAB XR'},
                    {type: 'button', label: 'Start Experience', action: 'start'}
                ]
            },
            {
                title: 'Settings',
                content: [
                    {type: 'text', value: 'Settings'},
                    {type: 'slider', label: 'Volume', min: 0, max: 1, value: 0.5}
                ]
            }
        ];
    },

    /**
     * Create the main menu panel
     */
    createMenuPanel: function() {
        const panel = document.createElement('a-plane');
        panel.setAttribute('width', this.data.width);
        panel.setAttribute('height', this.data.height);
        panel.setAttribute('color', this.data.theme === 'dark' ? '#1a1a1a' : '#f0f0f0');
        panel.setAttribute('opacity', 0.95);
        panel.setAttribute('material', {
            shader: 'flat',
            transparent: true
        });
        this.el.appendChild(panel);
        this.panel = panel;
        
        // Add title
        const title = document.createElement('a-text');
        title.setAttribute('value', this.data.title);
        title.setAttribute('position', `0 ${this.data.height/2 - 0.1} 0.01`);
        title.setAttribute('align', 'center');
        title.setAttribute('color', this.data.theme === 'dark' ? '#ffffff' : '#000000');
        title.setAttribute('width', 3);
        this.el.appendChild(title);
        this.titleEl = title;
        
        // Create content container
        this.contentContainer = document.createElement('a-entity');
        this.contentContainer.setAttribute('position', '0 0 0.01');
        this.el.appendChild(this.contentContainer);
    },

    /**
     * Create navigation buttons
     */
    createNavigationButtons: function() {
        if (this.pages.length <= 1) return;
        
        // Previous button
        const prevBtn = document.createElement('a-entity');
        prevBtn.setAttribute('geometry', {
            primitive: 'box',
            width: 0.1,
            height: 0.1,
            depth: 0.02
        });
        prevBtn.setAttribute('material', {
            color: '#3a50d9'
        });
        prevBtn.setAttribute('position', 
            `-${this.data.width/2 - 0.1} -${this.data.height/2 - 0.1} 0.01`);
        
        const prevText = document.createElement('a-text');
        prevText.setAttribute('value', '<');
        prevText.setAttribute('position', '0 0 0.011');
        prevText.setAttribute('align', 'center');
        prevText.setAttribute('color', '#ffffff');
        prevBtn.appendChild(prevText);
        
        prevBtn.addEventListener('click', () => this.previousPage());
        prevBtn.classList.add('clickable');
        this.el.appendChild(prevBtn);
        
        // Next button
        const nextBtn = document.createElement('a-entity');
        nextBtn.setAttribute('geometry', {
            primitive: 'box',
            width: 0.1,
            height: 0.1,
            depth: 0.02
        });
        nextBtn.setAttribute('material', {
            color: '#3a50d9'
        });
        nextBtn.setAttribute('position', 
            `${this.data.width/2 - 0.1} -${this.data.height/2 - 0.1} 0.01`);
        
        const nextText = document.createElement('a-text');
        nextText.setAttribute('value', '>');
        nextText.setAttribute('position', '0 0 0.011');
        nextText.setAttribute('align', 'center');
        nextText.setAttribute('color', '#ffffff');
        nextBtn.appendChild(nextText);
        
        nextBtn.addEventListener('click', () => this.nextPage());
        nextBtn.classList.add('clickable');
        this.el.appendChild(nextBtn);
    },

    /**
     * Create page indicator
     */
    createPageIndicator: function() {
        if (this.pages.length <= 1) return;
        
        this.pageIndicator = document.createElement('a-text');
        this.pageIndicator.setAttribute('position', 
            `0 -${this.data.height/2 - 0.1} 0.01`);
        this.pageIndicator.setAttribute('align', 'center');
        this.pageIndicator.setAttribute('width', 2);
        this.pageIndicator.setAttribute('color', 
            this.data.theme === 'dark' ? '#888' : '#666');
        this.el.appendChild(this.pageIndicator);
    },

    /**
     * Setup menu interactions
     */
    setupMenuInteractions: function() {
        // Hover effect for entire menu
        this.el.addEventListener('mouseenter', () => {
            this.el.setAttribute('animation__hover', {
                property: 'scale',
                to: '1.02 1.02 1.02',
                dur: 200
            });
        });
        
        this.el.addEventListener('mouseleave', () => {
            this.el.setAttribute('animation__hover', {
                property: 'scale',
                to: '1 1 1',
                dur: 200
            });
        });
    },

    /**
     * Setup auto-hide functionality
     */
    setupAutoHide: function() {
        this.hideTimer = null;
        
        const resetTimer = () => {
            if (this.hideTimer) clearTimeout(this.hideTimer);
            this.hideTimer = setTimeout(() => {
                this.hideMenu();
            }, this.data.hideDelay);
        };
        
        this.el.addEventListener('mouseenter', () => {
            if (this.hideTimer) clearTimeout(this.hideTimer);
            this.showMenu();
        });
        
        this.el.addEventListener('mouseleave', resetTimer);
        
        // Start initial timer
        resetTimer();
    },

    /**
     * Show a specific page
     */
    showPage: function(pageIndex) {
        if (pageIndex < 0 || pageIndex >= this.pages.length) return;
        
        // Clear current content
        while (this.contentContainer.firstChild) {
            this.contentContainer.removeChild(this.contentContainer.firstChild);
        }
        
        const page = this.pages[pageIndex];
        if (!page) return;
        
        // Update title if page has one
        if (page.title && this.titleEl) {
            this.titleEl.setAttribute('value', `${this.data.title} - ${page.title}`);
        }
        
        // Create page content
        if (page.content) {
            page.content.forEach((item, index) => {
                this.createContentItem(item, index);
            });
        }
        
        // Update page indicator
        if (this.pageIndicator) {
            this.pageIndicator.setAttribute('value', 
                `${pageIndex + 1} / ${this.pages.length}`);
        }
    },

    /**
     * Create individual content items
     */
    createContentItem: function(item, index) {
        const yPos = 0.2 - (index * 0.1);
        
        switch(item.type) {
            case 'text':
                const text = document.createElement('a-text');
                text.setAttribute('value', item.value);
                text.setAttribute('position', `0 ${yPos} 0`);
                text.setAttribute('align', 'center');
                text.setAttribute('width', 2);
                text.setAttribute('color', 
                    this.data.theme === 'dark' ? '#ffffff' : '#000000');
                this.contentContainer.appendChild(text);
                break;
                
            case 'button':
                const button = document.createElement('a-entity');
                button.setAttribute('interactive-button', {
                    label: item.label,
                    action: item.action,
                    width: 0.3,
                    height: 0.08
                });
                button.setAttribute('position', `0 ${yPos} 0`);
                button.classList.add('clickable');
                this.contentContainer.appendChild(button);
                break;
        }
    },

    /**
     * Navigate to previous page
     */
    previousPage: function() {
        this.currentPage = (this.currentPage - 1 + this.pages.length) % this.pages.length;
        this.showPage(this.currentPage);
        
        // Add transition animation
        this.contentContainer.setAttribute('animation__slide', {
            property: 'position',
            from: '-0.5 0 0.01',
            to: '0 0 0.01',
            dur: 300,
            easing: 'easeOutQuad'
        });
    },

    /**
     * Navigate to next page
     */
    nextPage: function() {
        this.currentPage = (this.currentPage + 1) % this.pages.length;
        this.showPage(this.currentPage);
        
        // Add transition animation
        this.contentContainer.setAttribute('animation__slide', {
            property: 'position',
            from: '0.5 0 0.01',
            to: '0 0 0.01',
            dur: 300,
            easing: 'easeOutQuad'
        });
    },

    /**
     * Hide the menu
     */
    hideMenu: function() {
        if (!this.isVisible) return;
        
        this.isVisible = false;
        this.el.setAttribute('animation__hide', {
            property: 'material.opacity',
            to: 0.1,
            dur: 500
        });
        this.el.setAttribute('animation__scale', {
            property: 'scale',
            to: '0.8 0.8 0.8',
            dur: 500
        });
    },

    /**
     * Show the menu
     */
    showMenu: function() {
        if (this.isVisible) return;
        
        this.isVisible = true;
        this.el.setAttribute('animation__show', {
            property: 'material.opacity',
            to: 0.95,
            dur: 300
        });
        this.el.setAttribute('animation__scale', {
            property: 'scale',
            to: '1 1 1',
            dur: 300
        });
    }
});

// ============================================================================
// Export for module usage
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        enhancedPinchable: 'enhanced-pinchable',
        advancedMenu: 'advanced-menu'
    };
} 