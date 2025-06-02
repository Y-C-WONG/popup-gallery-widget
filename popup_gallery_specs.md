# JavaScript Popup Gallery - Technical Specifications

## 1. Project Overview

**Product Name:** Universal Popup Gallery Widget  
**Version:** 1.0  
**Type:** Standalone JavaScript Component  
**Purpose:** Embeddable popup image gallery with lazy loading for any website

## 2. Functional Requirements

### 2.1 Core Features
- **Same-page popup overlay** that appears above all existing page content
- **Thumbnail gallery container** with lazy loading implementation
- **Full-size image viewer** triggered by thumbnail clicks
- **JSON-based image data** for easy content management
- **Universal compatibility** with any website/CMS

### 2.2 User Interactions
- Gallery opens via JavaScript function call
- Thumbnails load progressively as user scrolls (with preloading)
- Click thumbnail → full-size image displays
- **Close gallery options:**
  - Close button (X) in top-right corner
  - ESC key press
  - Click outside gallery container area
- Navigate between full-size images (previous/next arrows or swipe)
- **Touch device support:**
  - Swipe gestures for image navigation
  - Pinch-to-zoom on full-size images
  - Touch-optimized button sizes

## 3. Technical Architecture

### 3.1 Core Components
```
PopupGallery/
├── gallery-core.js        # Main JavaScript module
├── gallery-styles.css     # Embedded CSS styles
└── config.json           # Image data structure
```

### 3.2 HTML Structure Example
```html
<!-- Gallery overlay with pugw- prefix -->
<div id="pugw-gallery-main" class="pugw-overlay">
  <div class="pugw-container">
    <div class="pugw-header">
      <h2 class="pugw-title">Gallery Title</h2>
      <button class="pugw-close-btn">&times;</button>
    </div>
    
    <div class="pugw-thumbnail-grid">
      <img class="pugw-thumbnail" id="pugw-thumb-001" src="thumb1.jpg" alt="...">
      <img class="pugw-thumbnail" id="pugw-thumb-002" src="thumb2.jpg" alt="...">
    </div>
    
    <div class="pugw-fullsize-viewer">
      <img id="pugw-fullsize-img" src="large1.jpg" alt="...">
      <div class="pugw-navigation">
        <button class="pugw-nav-arrow pugw-prev">&lt;</button>
        <button class="pugw-nav-arrow pugw-next">&gt;</button>
      </div>
    </div>
  </div>
</div>
```

### 3.3 JavaScript Structure
- **Main Class:** `PopupGallery`
- **Initialization Method:** `init(configPath, options)`
- **Public Methods:**
  - `open()` - Display gallery
  - `close()` - Hide gallery
  - `loadImages(jsonUrl)` - Load image data
  - `setConfigFile(filename)` - Set JSON config filename dynamically
  - `setHeight(height)` - Set gallery height (px, %, vh, or 'auto')
  - `getHeight()` - Get current gallery height setting
- **Private Methods:**
  - `createOverlay()` - Build DOM structure with pugw- prefixed elements
  - `lazyLoad()` - Handle progressive image loading
  - `showFullImage(index)` - Display enlarged image
  - `cacheDOM()` - Cache frequently used pugw- prefixed DOM elements
  - `preloadThumbnails()` - Preload visible thumbnails
  - `handleOutsideClick()` - Close gallery on outside clicks
  - `applyHeight()` - Apply height settings to gallery container

### 3.4 DOM Caching Strategy
```javascript
// Cache all pugw- prefixed elements for performance
this.domCache = {
  overlay: document.getElementById('pugw-gallery-main'),
  container: document.querySelector('.pugw-container'),
  thumbnailGrid: document.querySelector('.pugw-thumbnail-grid'),
  fullsizeViewer: document.querySelector('.pugw-fullsize-viewer'),
  closeBtn: document.querySelector('.pugw-close-btn'),
  navArrows: document.querySelectorAll('.pugw-nav-arrow')
};
```

### 3.5 Height Configuration Options
```javascript
// Height configuration examples
const heightOptions = {
  pixels: '600px',           // Fixed pixel height
  percentage: '80%',         // Percentage of viewport height
  viewport: '90vh',          // Viewport height units
  auto: 'auto',             // Auto height based on content
  custom: 'calc(100vh - 100px)' // Custom CSS calculation
};
```

## 4. Data Structure

### 4.1 JSON Configuration Format
```json
{
  "gallery": {
    "title": "My Photo Gallery",
    "description": "Optional gallery description",
    "settings": {
      "height": "80vh",
      "maxHeight": "800px",
      "minHeight": "400px",
      "heightMode": "responsive"
    },
    "images": [
      {
        "id": "img001",
        "thumbnail": "https://example.com/images/thumbs/photo1_thumb.jpg",
        "fullsize": "https://example.com/images/full/photo1_large.jpg",
        "alt": "Beautiful sunset over mountains",
        "caption": "Captured during our hiking trip in the Rocky Mountains"
      },
      {
        "id": "img002", 
        "thumbnail": "https://example.com/images/thumbs/photo2_thumb.jpg",
        "fullsize": "https://example.com/images/full/photo2_large.jpg",
        "alt": "City skyline at night",
        "caption": "Downtown cityscape with illuminated skyscrapers"
      }
    ]
  }
}
```

### 4.2 Dynamic Configuration Loading
```javascript
// Variable JSON filename support with height options
const gallery = new PopupGallery();
gallery.setConfigFile('summer-photos.json');
gallery.setHeight('70vh'); // Set height before initialization
gallery.init();

// Or direct initialization with variable filename and options
const options = { height: '600px', maxHeight: '90vh' };
gallery.init('vacation-gallery.json', options);
```

### 4.3 Height Setting Options
**Supported Height Values:**
- **Fixed pixels:** `'500px'`, `'600px'`, `'800px'`
- **Viewport height:** `'60vh'`, `'80vh'`, `'90vh'`
- **Percentage:** `'75%'`, `'85%'` (of viewport height)
- **Auto:** `'auto'` (adjusts to content)
- **CSS calc:** `'calc(100vh - 120px)'` (custom calculations)

**Height Modes:**
- **`fixed`** - Uses exact height value on all devices
- **`responsive`** - Adjusts height based on device type
- **`adaptive`** - Automatically optimizes for content

## 5. Implementation Requirements

### 5.1 CSS Specifications
- **Z-index:** 9999+ for overlay positioning
- **Responsive design** for mobile/tablet/desktop
- **Smooth transitions** for open/close animations
- **Flexible layout** adapting to various screen sizes
- **Namespace Protection:** All CSS classes and IDs must begin with "pugw-" prefix to prevent conflicts

### 5.2 CSS Naming Convention
**Required Prefix:** All HTML classes and IDs must start with "pugw-"

**Example Class Names:**
```css
.pugw-overlay          /* Main gallery overlay */
.pugw-container        /* Gallery container */
.pugw-thumbnail-grid   /* Thumbnail grid layout */
.pugw-thumbnail        /* Individual thumbnail */
.pugw-fullsize-viewer  /* Full-size image viewer */
.pugw-close-btn        /* Close button */
.pugw-nav-arrow        /* Navigation arrows */
.pugw-loading          /* Loading spinner */
.pugw-error            /* Error states */
```

**Example ID Names:**
```css
#pugw-gallery-main     /* Main gallery element */
#pugw-fullsize-img     /* Current full-size image */
#pugw-thumbnail-001    /* Individual thumbnail IDs */
```

### 5.2 Lazy Loading Implementation
- **Intersection Observer API** for modern browsers
- **Fallback method** for older browser support
- **Loading placeholder** during image fetch
- **Error handling** for failed image loads

### 5.3 Performance Optimization
- **DOM Caching Strategy:**
  - Cache gallery container, thumbnail grid, and overlay elements
  - Store references to frequently accessed DOM nodes
  - Minimize DOM queries during scroll and interaction events
  
- **Thumbnail Preloading:**
  - Preload thumbnails in viewport + 2 rows ahead
  - Use `Image()` constructor for background loading
  - Implement priority queue for loading sequence
  - Cancel unnecessary requests when user scrolls away

### 5.4 Performance Requirements
- **Minimal initial load** - core JS < 15KB minified
- **Progressive enhancement** - works without JavaScript  
- **Memory efficient** - unload off-screen images
- **Fast rendering** - < 100ms gallery open time
- **DOM caching** - Cache frequently accessed DOM elements to prevent repeated queries
- **Thumbnail preloading** - Preload visible and next-visible thumbnails for smooth scrolling
- **Image optimization** - Support for modern formats (WebP, AVIF) with fallbacks

## 6. Compatibility Requirements

### 6.1 Browser Support
- **Modern browsers:** Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Legacy support:** IE11 with polyfills
- **Mobile browsers:** iOS Safari 12+, Chrome Mobile 60+

### 6.2 CMS Integration
- **WordPress:** Compatible with all themes
- **Drupal:** No theme conflicts
- **Joomla:** Universal integration
- **Custom sites:** Zero dependency injection

### 6.3 Embedding Methods
```javascript
// Method 1: Direct initialization with variable config and height
const gallery = new PopupGallery();
gallery.setConfigFile('my-gallery-config.json');
gallery.setHeight('70vh');
gallery.init();

// Method 2: Initialization with dynamic filename and height options
const gallery = new PopupGallery();
const options = { 
  height: '600px', 
  maxHeight: '90vh',
  heightMode: 'responsive' 
};
gallery.init('summer-vacation-2024.json', options);

// Method 3: Global function with variable filename and height
window.openGallery('product-showcase.json', { height: '80vh' });

// Method 4: HTML data attributes with dynamic config and height
<button data-gallery="event-photos.json" data-height="500px">Open Gallery</button>
<button data-gallery="portfolio-images.json" data-height="90vh">View Portfolio</button>

// Method 5: Programmatic height changes
const gallery = new PopupGallery();
gallery.init('gallery.json');
gallery.setHeight('400px');  // Change height after initialization
```

### 6.4 Responsive CSS Framework with Variable Height
```css
/* Mobile-first responsive approach with pugw- prefix and height variables */
:root {
  --pugw-gallery-height: 80vh;        /* Default height */
  --pugw-gallery-max-height: 90vh;    /* Maximum height */
  --pugw-gallery-min-height: 400px;   /* Minimum height */
}

/* Base styles with height variables */
.pugw-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  height: var(--pugw-gallery-height);
  max-height: var(--pugw-gallery-max-height);
  min-height: var(--pugw-gallery-min-height);
  overflow-y: auto;
  box-sizing: border-box;
}

/* Height modes */
.pugw-container.pugw-height-fixed {
  height: var(--pugw-gallery-height);
  resize: none;
}

.pugw-container.pugw-height-responsive {
  height: var(--pugw-gallery-height);
}

.pugw-container.pugw-height-adaptive {
  height: auto;
  max-height: var(--pugw-gallery-max-height);
}

/* Responsive height adjustments */
@media (min-width: 320px) { 
  /* Mobile: Reduce height for virtual keyboards */
  .pugw-container.pugw-height-responsive {
    --pugw-gallery-height: calc(var(--pugw-gallery-height) * 0.8);
    --pugw-gallery-min-height: 300px;
  }
}

@media (min-width: 768px) { 
  /* Tablet: Slight height reduction */
  .pugw-container.pugw-height-responsive {
    --pugw-gallery-height: calc(var(--pugw-gallery-height) * 0.9);
    --pugw-gallery-min-height: 350px;
  }
}

@media (min-width: 1024px) { 
  /* Desktop: Full height */
  .pugw-container.pugw-height-responsive {
    --pugw-gallery-height: var(--pugw-gallery-height);
    --pugw-gallery-min-height: 400px;
  }
}

/* CSS Grid with fallback to Flexbox */
.pugw-thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  height: calc(100% - 80px); /* Subtract header height */
  overflow-y: auto;
}

/* Fallback for older browsers */
.pugw-thumbnail-grid.pugw-fallback {
  display: flex;
  flex-wrap: wrap;
}

/* Gallery overlay */
.pugw-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* JavaScript height setting integration */
.pugw-container[data-height] {
  height: attr(data-height);
}

.pugw-container[data-max-height] {
  max-height: attr(data-max-height);
}
```

## 7. User Interface Specifications

### 7.1 Gallery Overlay
- **Background:** Semi-transparent dark overlay (rgba(0,0,0,0.8))
- **Position:** Fixed, full viewport coverage
- **Animation:** Fade-in/fade-out (300ms)
- **Outside Click:** Close gallery when clicking outside the container area

### 7.2 Responsive Thumbnail Container
**Desktop (1024px+):**
- **Layout:** 6-column grid system
- **Thumbnail size:** 180x180px
- **Container width:** 90% viewport width, max 1200px
- **Default height:** 80vh (customizable)
- **Height range:** 400px minimum, 90vh maximum

**Tablet (768px - 1023px):**
- **Layout:** 4-column grid system  
- **Thumbnail size:** 160x160px
- **Container width:** 95% viewport width
- **Default height:** 75vh (customizable)
- **Height range:** 350px minimum, 85vh maximum

**Mobile (320px - 767px):**
- **Layout:** 2-column grid system
- **Thumbnail size:** 140x140px
- **Container width:** 98% viewport width
- **Default height:** 70vh (customizable)
- **Height range:** 300px minimum, 80vh maximum
- **Touch optimizations:** Larger touch targets, swipe gestures

### 7.3 Height-Responsive Behavior
**Fixed Height Mode:**
- Uses exact height value across all devices
- Automatically adds scrollbars if content overflows
- Maintains consistent appearance regardless of screen size

**Responsive Height Mode:**
- Adjusts height based on device type and orientation
- Desktop: Uses full specified height
- Tablet: Reduces height by 10% for better usability
- Mobile: Reduces height by 20% to account for virtual keyboards

**Adaptive Height Mode:**
- Automatically calculates optimal height based on content
- Considers number of images and screen size
- Ensures minimum visibility of at least 6 thumbnails

### 7.3 Responsive Full-size Viewer
**Desktop:**
- **Max dimensions:** 90% viewport width/height
- **Controls:** Hover-revealed navigation arrows
- **Image scaling:** Maintain aspect ratio, center alignment

**Tablet:**
- **Max dimensions:** 95% viewport width/height  
- **Controls:** Always-visible navigation buttons
- **Touch gestures:** Swipe left/right for navigation

**Mobile:**
- **Max dimensions:** 98% viewport width/height
- **Controls:** Large touch-friendly buttons
- **Zoom capability:** Pinch-to-zoom support
- **Full-screen mode:** Option for immersive viewing

## 8. Security & Accessibility

### 8.1 Security Measures
- **XSS prevention:** Sanitize all user inputs
- **CORS handling:** Proper cross-origin image loading
- **Content validation:** Verify image URLs and formats
- **Namespace isolation:** "pugw-" prefix prevents CSS conflicts and accidental overrides
- **DOM pollution prevention:** All elements use prefixed classes to avoid conflicts

### 8.2 Accessibility Features
- **Keyboard navigation:** Tab, Enter, ESC key support
- **Screen reader:** Proper ARIA labels and roles with "pugw-" prefixed IDs
- **Focus management:** Trap focus within modal using pugw-focusable elements
- **Alt text:** Support for image descriptions via JSON configuration

## 9. Error Handling

### 9.1 Image Loading Errors
- **Fallback images:** Display placeholder for broken images
- **Retry mechanism:** Attempt reload on network errors
- **User feedback:** Show loading states and error messages

### 9.2 Configuration Errors
- **JSON validation:** Handle malformed configuration files
- **Missing files:** Graceful degradation when assets unavailable
- **Console logging:** Development-friendly error messages

## 10. Deployment Specifications

### 10.1 File Structure
```
gallery-widget/
├── dist/
│   ├── popup-gallery.min.js    # Production JavaScript
│   ├── popup-gallery.css       # Styles
│   └── gallery-config.json     # Sample configuration
└── examples/
    ├── basic-usage.html
    ├── wordpress-integration.php
    └── advanced-config.json
```

### 10.2 CDN Integration
- **Hosted version:** Available via CDN for easy integration
- **Self-hosted:** Downloadable package for local hosting
- **Version management:** Semantic versioning (1.0.0)

## 11. Testing Requirements

### 11.1 Functionality Testing
- Cross-browser compatibility testing
- Mobile responsiveness verification
- CMS integration testing (WordPress, Drupal, etc.)
- Performance benchmarking

### 11.2 User Experience Testing
- Gallery load time measurement
- Image lazy loading verification
- Keyboard accessibility testing
- Screen reader compatibility

## 12. Documentation Deliverables

### 12.1 Developer Documentation
- **Installation guide** with code examples
- **API reference** for all public methods
- **Configuration options** comprehensive list
- **Troubleshooting guide** for common issues

### 12.2 Integration Examples
- WordPress plugin integration
- HTML/CSS framework compatibility
- Custom theme implementation guides
- Advanced customization tutorials