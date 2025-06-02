# Universal Popup Gallery Widget

A lightweight, responsive, and highly customizable JavaScript popup gallery widget that can be embedded in any website or CMS. Features lazy loading, touch support, keyboard navigation, and flexible height configuration.

## Features

- 🖼️ **Responsive Design** - Adapts beautifully to mobile, tablet, and desktop screens
- 🚀 **Lazy Loading** - Thumbnails load progressively as users scroll for optimal performance
- 📱 **Touch Support** - Swipe gestures and pinch-to-zoom on mobile devices
- ⌨️ **Keyboard Navigation** - Full keyboard support (ESC, arrow keys, Tab)
- 🎨 **Customizable Heights** - Flexible height options (px, vh, %, auto, calc())
- 🔧 **Zero Dependencies** - Pure JavaScript, no external libraries required
- 🌐 **Universal Compatibility** - Works with WordPress, Drupal, Joomla, and custom sites
- 🎯 **Namespace Protection** - All CSS classes prefixed with `pugw-` to prevent conflicts
- ♿ **Accessible** - ARIA labels, focus management, and screen reader support
- 🌙 **Dark Mode Support** - Automatically adapts to system preferences

## Quick Start

### 1. Include the Files

```html
<!-- Include CSS -->
<link rel="stylesheet" href="path/to/gallery-styles.css">

<!-- Include JavaScript -->
<script src="path/to/gallery-core.js"></script>
```

### 2. Create a Configuration File

Create a JSON file (e.g., `gallery-config.json`) with your images:

```json
{
  "gallery": {
    "title": "My Photo Gallery",
    "settings": {
      "height": "80vh",
      "heightMode": "responsive"
    },
    "images": [
      {
        "id": "img001",
        "thumbnail": "path/to/thumb1.jpg",
        "fullsize": "path/to/full1.jpg",
        "alt": "Image description",
        "caption": "Optional caption text"
      }
    ]
  }
}
```

### 3. Open the Gallery

```html
<button onclick="openGallery('gallery-config.json')">Open Gallery</button>
```

## Installation Methods

### Method 1: CDN (Coming Soon)
```html
<link rel="stylesheet" href="https://cdn.example.com/popup-gallery/1.0/gallery-styles.css">
<script src="https://cdn.example.com/popup-gallery/1.0/gallery-core.js"></script>
```

### Method 2: Download and Self-Host
1. Download the gallery files
2. Upload to your website
3. Include the CSS and JavaScript files

### Method 3: NPM (Coming Soon)
```bash
npm install popup-gallery-widget
```

## Usage Examples

### Basic Usage

```javascript
// Simple gallery with default settings
openGallery('my-photos.json');
```

### With Custom Height

```javascript
// Open gallery with specific height
openGallery('my-photos.json', { height: '600px' });
```

### Using Data Attributes

```html
<button data-gallery="vacation-photos.json" data-height="70vh">
    View Vacation Photos
</button>
```

### Programmatic Control

```javascript
// Create gallery instance
const gallery = new PopupGallery();

// Configure settings
gallery.setConfigFile('portfolio.json');
gallery.setHeight('80vh');

// Initialize and open
gallery.init().then(() => {
    gallery.open();
});

// Later, you can close it
gallery.close();

// Or change height dynamically
gallery.setHeight('500px');
```

## Height Configuration

The gallery supports various height options:

| Value Type | Example | Description |
|------------|---------|-------------|
| Fixed pixels | `'600px'` | Fixed height in pixels |
| Viewport height | `'80vh'` | Percentage of viewport height |
| Percentage | `'75%'` | Percentage of container |
| Auto | `'auto'` | Adjusts to content |
| CSS calc | `'calc(100vh - 100px)'` | Custom calculations |

### Height Modes

- **`fixed`** - Uses exact height value on all devices
- **`responsive`** - Adjusts height based on device type
- **`adaptive`** - Automatically optimizes for content

## Configuration Options

### Gallery Settings

```json
{
  "gallery": {
    "title": "Gallery Title",
    "description": "Optional description",
    "settings": {
      "height": "80vh",
      "maxHeight": "800px",
      "minHeight": "400px",
      "heightMode": "responsive"
    },
    "images": [...]
  }
}
```

### Image Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `thumbnail` | string | Yes | URL to thumbnail image |
| `fullsize` | string | Yes | URL to full-size image |
| `alt` | string | No | Alt text for accessibility |
| `caption` | string | No | Caption displayed with full image |

## API Reference

### Methods

#### `new PopupGallery()`
Creates a new gallery instance.

#### `init(configPath, options)`
Initializes the gallery with configuration.
- `configPath` (string, optional): Path to JSON configuration file
- `options` (object, optional): Height and other settings

#### `open()`
Opens the gallery overlay.

#### `close()`
Closes the gallery overlay.

#### `setConfigFile(filename)`
Sets the configuration file path.
- `filename` (string): Path to JSON configuration

#### `setHeight(height)`
Sets the gallery height.
- `height` (string): Height value (px, vh, %, auto, etc.)

#### `getHeight()`
Returns the current height setting.

#### `loadImages(jsonUrl)`
Loads images from a JSON configuration file.
- `jsonUrl` (string): URL to JSON file

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ iOS Safari 12+
- ✅ Chrome Mobile 60+
- ⚠️ IE11 (with polyfills)

## Performance Optimization

The gallery implements several performance optimizations:

1. **Lazy Loading** - Only loads visible thumbnails
2. **DOM Caching** - Caches frequently accessed elements
3. **Thumbnail Preloading** - Preloads next visible thumbnails
4. **Image Queue Management** - Prioritizes visible images
5. **Memory Management** - Unloads off-screen images

## Accessibility Features

- **Keyboard Navigation**: Tab, Enter, ESC, Arrow keys
- **ARIA Labels**: Proper labels for screen readers
- **Focus Management**: Trapped focus within modal
- **Reduced Motion**: Respects user preferences
- **High Contrast**: Works with high contrast modes

## CSS Customization

All CSS classes are prefixed with `pugw-` to prevent conflicts:

```css
/* Customize gallery appearance */
.pugw-container {
    background: #f0f0f0;
}

.pugw-thumbnail:hover {
    transform: scale(1.1);
}

.pugw-title {
    font-family: 'Your Custom Font', sans-serif;
}
```

## WordPress Integration

```php
// In your theme or plugin
function enqueue_popup_gallery() {
    wp_enqueue_style('popup-gallery', 
        get_template_directory_uri() . '/gallery/gallery-styles.css');
    wp_enqueue_script('popup-gallery', 
        get_template_directory_uri() . '/gallery/gallery-core.js', 
        array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'enqueue_popup_gallery');
```

## Troubleshooting

### Gallery doesn't open
- Check browser console for errors
- Verify JSON configuration file path
- Ensure images are accessible (CORS)

### Images not loading
- Check image URLs in configuration
- Verify CORS headers if loading from different domain
- Check network tab for failed requests

### Performance issues
- Reduce thumbnail size
- Enable lazy loading (default)
- Optimize image file sizes

## License

MIT License - feel free to use in personal and commercial projects.

## Contributing

Contributions are welcome! Please submit issues and pull requests on GitHub.

## Version History

- **1.0.0** (2024-01) - Initial release
  - Core gallery functionality
  - Lazy loading implementation
  - Responsive design
  - Touch support
  - Keyboard navigation
  - Height configuration options