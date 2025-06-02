/**
 * Universal Popup Gallery Widget
 * Version: 1.0
 * A standalone JavaScript component for embeddable popup image galleries
 */

class PopupGallery {
    constructor() {
        this.config = null;
        this.configPath = 'config.json';
        this.domCache = {};
        this.currentImageIndex = 0;
        this.images = [];
        this.heightSettings = {
            height: '80vh',
            maxHeight: '90vh',
            minHeight: '400px',
            heightMode: 'responsive'
        };
        this.loadedThumbnails = new Set();
        this.thumbnailQueue = [];
        this.isLoading = false;
        this.observer = null;
        this.touchStartX = null;
        this.touchStartY = null;
        
        // Bind methods
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
    }

    /**
     * Initialize the gallery with optional config path and options
     * @param {string} configPath - Path to JSON configuration file
     * @param {object} options - Additional options including height settings
     */
    async init(configPath = null, options = {}) {
        try {
            if (configPath) {
                this.configPath = configPath;
            }
            
            // Merge height options
            if (options.height) this.heightSettings.height = options.height;
            if (options.maxHeight) this.heightSettings.maxHeight = options.maxHeight;
            if (options.minHeight) this.heightSettings.minHeight = options.minHeight;
            if (options.heightMode) this.heightSettings.heightMode = options.heightMode;
            
            await this.loadImages(this.configPath);
            this.createOverlay();
            this.setupIntersectionObserver();
            this.attachEventListeners();
            
        } catch (error) {
            console.error('PopupGallery initialization error:', error);
            this.showError('Failed to initialize gallery');
        }
    }

    /**
     * Set configuration file dynamically
     * @param {string} filename - JSON configuration filename
     */
    setConfigFile(filename) {
        this.configPath = filename;
    }

    /**
     * Set gallery height
     * @param {string} height - Height value (px, %, vh, auto, or calc())
     */
    setHeight(height) {
        this.heightSettings.height = height;
        if (this.domCache.container) {
            this.applyHeight();
        }
    }

    /**
     * Get current gallery height setting
     * @returns {string} Current height value
     */
    getHeight() {
        return this.heightSettings.height;
    }

    /**
     * Load image data from JSON configuration
     * @param {string} jsonUrl - URL to JSON configuration file
     */
    async loadImages(jsonUrl) {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) {
                throw new Error(`Failed to load configuration: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.config = data.gallery;
            this.images = this.config.images || [];
            
            // Apply height settings from config if available
            if (this.config.settings) {
                Object.assign(this.heightSettings, this.config.settings);
            }
            
        } catch (error) {
            console.error('Error loading gallery configuration:', error);
            throw error;
        }
    }

    /**
     * Create gallery overlay and DOM structure
     */
    createOverlay() {
        // Remove existing overlay if present
        const existingOverlay = document.getElementById('pugw-gallery-main');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Create main overlay
        const overlay = document.createElement('div');
        overlay.id = 'pugw-gallery-main';
        overlay.className = 'pugw-overlay';
        overlay.style.display = 'none';

        // Create container
        const container = document.createElement('div');
        container.className = 'pugw-container';
        
        // Apply height mode class
        container.classList.add(`pugw-height-${this.heightSettings.heightMode}`);

        // Create header
        const header = document.createElement('div');
        header.className = 'pugw-header';
        
        const title = document.createElement('h2');
        title.className = 'pugw-title';
        title.textContent = this.config.title || 'Gallery';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'pugw-close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close gallery');
        
        header.appendChild(title);
        header.appendChild(closeBtn);

        // Create thumbnail grid
        const thumbnailGrid = document.createElement('div');
        thumbnailGrid.className = 'pugw-thumbnail-grid';
        
        // Add thumbnails
        this.images.forEach((image, index) => {
            const thumb = document.createElement('img');
            thumb.className = 'pugw-thumbnail pugw-lazy';
            thumb.id = `pugw-thumb-${image.id}`;
            thumb.dataset.src = image.thumbnail;
            thumb.dataset.index = index;
            thumb.alt = image.alt || '';
            thumb.setAttribute('tabindex', '0');
            thumb.setAttribute('role', 'button');
            thumb.setAttribute('aria-label', `View ${image.alt || 'image'}`);
            
            // Add loading placeholder
            thumb.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="180" height="180"%3E%3Crect width="180" height="180" fill="%23ddd"/%3E%3C/svg%3E';
            
            thumbnailGrid.appendChild(thumb);
        });

        // Create fullsize viewer
        const fullsizeViewer = document.createElement('div');
        fullsizeViewer.className = 'pugw-fullsize-viewer';
        fullsizeViewer.style.display = 'none';
        
        const fullsizeImg = document.createElement('img');
        fullsizeImg.id = 'pugw-fullsize-img';
        fullsizeImg.alt = '';
        
        const navigation = document.createElement('div');
        navigation.className = 'pugw-navigation';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pugw-nav-arrow pugw-prev';
        prevBtn.innerHTML = '&lt;';
        prevBtn.setAttribute('aria-label', 'Previous image');
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pugw-nav-arrow pugw-next';
        nextBtn.innerHTML = '&gt;';
        nextBtn.setAttribute('aria-label', 'Next image');
        
        const caption = document.createElement('div');
        caption.className = 'pugw-caption';
        
        navigation.appendChild(prevBtn);
        navigation.appendChild(nextBtn);
        
        fullsizeViewer.appendChild(fullsizeImg);
        fullsizeViewer.appendChild(navigation);
        fullsizeViewer.appendChild(caption);

        // Assemble DOM
        container.appendChild(header);
        container.appendChild(thumbnailGrid);
        container.appendChild(fullsizeViewer);
        overlay.appendChild(container);
        
        // Add to document
        document.body.appendChild(overlay);
        
        // Cache DOM elements
        this.cacheDOM();
        
        // Apply height settings
        this.applyHeight();
    }

    /**
     * Cache frequently accessed DOM elements
     */
    cacheDOM() {
        this.domCache = {
            overlay: document.getElementById('pugw-gallery-main'),
            container: document.querySelector('.pugw-container'),
            thumbnailGrid: document.querySelector('.pugw-thumbnail-grid'),
            thumbnails: document.querySelectorAll('.pugw-thumbnail'),
            fullsizeViewer: document.querySelector('.pugw-fullsize-viewer'),
            fullsizeImg: document.getElementById('pugw-fullsize-img'),
            closeBtn: document.querySelector('.pugw-close-btn'),
            prevBtn: document.querySelector('.pugw-prev'),
            nextBtn: document.querySelector('.pugw-next'),
            caption: document.querySelector('.pugw-caption'),
            title: document.querySelector('.pugw-title')
        };
    }

    /**
     * Apply height settings to gallery container
     */
    applyHeight() {
        if (!this.domCache.container) return;
        
        const container = this.domCache.container;
        const height = this.heightSettings.height;
        
        // Set CSS custom properties
        container.style.setProperty('--pugw-gallery-height', height);
        container.style.setProperty('--pugw-gallery-max-height', this.heightSettings.maxHeight);
        container.style.setProperty('--pugw-gallery-min-height', this.heightSettings.minHeight);
        
        // Apply data attributes for CSS integration
        container.dataset.height = height;
        container.dataset.maxHeight = this.heightSettings.maxHeight;
        container.dataset.minHeight = this.heightSettings.minHeight;
    }

    /**
     * Setup Intersection Observer for lazy loading
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            this.loadAllThumbnails();
            return;
        }

        const options = {
            root: this.domCache.thumbnailGrid,
            rootMargin: '50px',
            threshold: 0.01
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadThumbnail(entry.target);
                }
            });
        }, options);

        // Observe all lazy thumbnails
        this.domCache.thumbnails.forEach(thumb => {
            if (thumb.classList.contains('pugw-lazy')) {
                this.observer.observe(thumb);
            }
        });
    }

    /**
     * Load individual thumbnail
     * @param {HTMLElement} thumbnail - Thumbnail element to load
     */
    loadThumbnail(thumbnail) {
        if (this.loadedThumbnails.has(thumbnail.id)) return;
        
        const src = thumbnail.dataset.src;
        if (!src) return;

        const img = new Image();
        img.onload = () => {
            thumbnail.src = src;
            thumbnail.classList.remove('pugw-lazy');
            thumbnail.classList.add('pugw-loaded');
            this.loadedThumbnails.add(thumbnail.id);
            
            if (this.observer) {
                this.observer.unobserve(thumbnail);
            }
        };

        img.onerror = () => {
            thumbnail.classList.add('pugw-error');
            console.error(`Failed to load thumbnail: ${src}`);
        };

        img.src = src;
    }

    /**
     * Preload thumbnails around the current viewport
     */
    preloadThumbnails() {
        const grid = this.domCache.thumbnailGrid;
        const gridRect = grid.getBoundingClientRect();
        
        this.domCache.thumbnails.forEach((thumb, index) => {
            const thumbRect = thumb.getBoundingClientRect();
            
            // Check if thumbnail is within preload range (2 rows ahead)
            if (thumbRect.top < gridRect.bottom + 360 && 
                thumbRect.bottom > gridRect.top - 360) {
                this.loadThumbnail(thumb);
            }
        });
    }

    /**
     * Fallback method to load all thumbnails (for older browsers)
     */
    loadAllThumbnails() {
        this.domCache.thumbnails.forEach(thumb => {
            this.loadThumbnail(thumb);
        });
    }

    /**
     * Show full-size image
     * @param {number} index - Image index to display
     */
    showFullImage(index) {
        if (index < 0 || index >= this.images.length) return;
        
        this.currentImageIndex = index;
        const image = this.images[index];
        
        // Update fullsize viewer
        const fullsizeImg = this.domCache.fullsizeImg;
        const caption = this.domCache.caption;
        
        // Show loading state
        fullsizeImg.classList.add('pugw-loading');
        
        // Load full-size image
        const img = new Image();
        img.onload = () => {
            fullsizeImg.src = image.fullsize;
            fullsizeImg.alt = image.alt || '';
            fullsizeImg.classList.remove('pugw-loading');
            
            // Update caption
            caption.textContent = image.caption || '';
            caption.style.display = image.caption ? 'block' : 'none';
        };

        img.onerror = () => {
            fullsizeImg.classList.remove('pugw-loading');
            this.showError('Failed to load image');
        };

        img.src = image.fullsize;
        
        // Show fullsize viewer
        this.domCache.thumbnailGrid.style.display = 'none';
        this.domCache.fullsizeViewer.style.display = 'block';
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }

    /**
     * Update navigation button states
     */
    updateNavigationButtons() {
        this.domCache.prevBtn.disabled = this.currentImageIndex === 0;
        this.domCache.nextBtn.disabled = this.currentImageIndex === this.images.length - 1;
    }

    /**
     * Navigate to previous image
     */
    prevImage() {
        if (this.currentImageIndex > 0) {
            this.showFullImage(this.currentImageIndex - 1);
        }
    }

    /**
     * Navigate to next image
     */
    nextImage() {
        if (this.currentImageIndex < this.images.length - 1) {
            this.showFullImage(this.currentImageIndex + 1);
        }
    }

    /**
     * Return to thumbnail view
     */
    showThumbnails() {
        this.domCache.fullsizeViewer.style.display = 'none';
        this.domCache.thumbnailGrid.style.display = 'grid';
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Close button
        this.domCache.closeBtn.addEventListener('click', () => this.close());
        
        // Thumbnail clicks
        this.domCache.thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.dataset.index);
                this.showFullImage(index);
            });
            
            // Keyboard support for thumbnails
            thumb.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const index = parseInt(thumb.dataset.index);
                    this.showFullImage(index);
                }
            });
        });
        
        // Navigation buttons
        this.domCache.prevBtn.addEventListener('click', () => this.prevImage());
        this.domCache.nextBtn.addEventListener('click', () => this.nextImage());
        
        // Fullsize image click (return to thumbnails)
        this.domCache.fullsizeImg.addEventListener('click', () => this.showThumbnails());
        
        // Scroll event for preloading
        this.domCache.thumbnailGrid.addEventListener('scroll', 
            this.debounce(() => this.preloadThumbnails(), 100)
        );
        
        // Touch events
        if ('ontouchstart' in window) {
            this.domCache.fullsizeViewer.addEventListener('touchstart', this.handleTouchStart);
            this.domCache.fullsizeViewer.addEventListener('touchend', this.handleTouchEnd);
        }
    }

    /**
     * Handle touch start event
     * @param {TouchEvent} e - Touch event
     */
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }

    /**
     * Handle touch end event for swipe gestures
     * @param {TouchEvent} e - Touch event
     */
    handleTouchEnd(e) {
        if (!this.touchStartX || !this.touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - this.touchStartX;
        const deltaY = touchEndY - this.touchStartY;
        
        // Check if horizontal swipe is greater than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                this.prevImage();
            } else {
                this.nextImage();
            }
        }
        
        this.touchStartX = null;
        this.touchStartY = null;
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyDown(e) {
        switch (e.key) {
            case 'Escape':
                this.close();
                break;
            case 'ArrowLeft':
                if (this.domCache.fullsizeViewer.style.display === 'block') {
                    this.prevImage();
                }
                break;
            case 'ArrowRight':
                if (this.domCache.fullsizeViewer.style.display === 'block') {
                    this.nextImage();
                }
                break;
        }
    }

    /**
     * Handle clicks outside the gallery container
     * @param {MouseEvent} e - Click event
     */
    handleOutsideClick(e) {
        if (e.target === this.domCache.overlay) {
            this.close();
        }
    }

    /**
     * Handle window resize events
     */
    handleResize() {
        if (this.heightSettings.heightMode === 'responsive') {
            this.applyHeight();
        }
    }

    /**
     * Open the gallery
     */
    open() {
        if (!this.domCache.overlay) {
            console.error('Gallery not initialized');
            return;
        }
        
        this.domCache.overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add event listeners
        document.addEventListener('keydown', this.handleKeyDown);
        this.domCache.overlay.addEventListener('click', this.handleOutsideClick);
        window.addEventListener('resize', this.handleResize);
        
        // Start lazy loading
        this.preloadThumbnails();
        
        // Focus management
        this.domCache.closeBtn.focus();
    }

    /**
     * Close the gallery
     */
    close() {
        if (!this.domCache.overlay) return;
        
        this.domCache.overlay.style.display = 'none';
        document.body.style.overflow = '';
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyDown);
        this.domCache.overlay.removeEventListener('click', this.handleOutsideClick);
        window.removeEventListener('resize', this.handleResize);
        
        // Reset to thumbnail view
        this.showThumbnails();
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        console.error('PopupGallery Error:', message);
        
        // Create error notification
        const error = document.createElement('div');
        error.className = 'pugw-error-message';
        error.textContent = message;
        
        if (this.domCache.container) {
            this.domCache.container.appendChild(error);
            
            setTimeout(() => {
                error.remove();
            }, 3000);
        }
    }

    /**
     * Debounce utility function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Global function for easy access
window.openGallery = function(configFile, options = {}) {
    const gallery = new PopupGallery();
    gallery.init(configFile, options).then(() => {
        gallery.open();
    });
};

// Auto-initialize galleries with data attributes
document.addEventListener('DOMContentLoaded', () => {
    const galleryButtons = document.querySelectorAll('[data-gallery]');
    
    galleryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const configFile = button.dataset.gallery;
            const height = button.dataset.height;
            
            const options = {};
            if (height) options.height = height;
            
            window.openGallery(configFile, options);
        });
    });
});

// Export for module usage
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = PopupGallery;
}