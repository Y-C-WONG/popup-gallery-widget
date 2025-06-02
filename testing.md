# Popup Gallery Widget - Testing Guide

## Overview

This guide provides step-by-step instructions for testing the Popup Gallery Widget locally. Due to browser security restrictions (CORS policy), the gallery must be served from a web server rather than opened directly from the file system.

## Why a Web Server is Required

Modern browsers block `fetch()` requests to local files when using the `file://` protocol. Since the gallery loads its configuration from `config.json` using `fetch()`, you must serve the files through a local web server using the `http://` protocol.

## Prerequisites

- Python 3.x installed on your system
- Web browser (Chrome, Firefox, Safari, or Edge)
- All gallery files in the same directory

## Testing Steps

### 1. Start a Local Web Server

Open a terminal/command prompt and navigate to the gallery directory:

```bash
cd C:\Users\mathu\Documents\DC_OUT\popup-gallery-widget
```

Start the Python HTTP server:

```bash
python -m http.server 8000
```

You should see output indicating the server is running. Keep this terminal window open.

### 2. Open the Gallery Example

Open your web browser and navigate to:

```
http://localhost:8000/example.html
```

### 3. Test Gallery Features

#### Basic Functionality Tests

1. **Test Different Opening Methods:**
   - Click "Open Default Gallery" - Should open with 80vh height
   - Click "Open Gallery (60vh height)" - Should open with 60% viewport height
   - Click "Open Gallery (500px height)" - Should open with fixed 500px height
   - Click "Open Custom Gallery" - Should open with programmatic settings

2. **Test Gallery Navigation:**
   - Click any thumbnail to view full-size image
   - Use left/right arrow keys to navigate between images
   - Click on the full-size image to return to thumbnail view
   - Use the navigation arrows (< >) to move between images

3. **Test Closing Methods:**
   - Press ESC key to close gallery
   - Click the X button in top-right corner
   - Click outside the gallery container (on the dark overlay)

4. **Test Responsive Behavior:**
   - Resize browser window to test responsive layout
   - Check thumbnail grid adjusts (6 cols → 4 cols → 2 cols)
   - Verify gallery height adjusts appropriately

#### Advanced Feature Tests

1. **Lazy Loading:**
   - Open gallery and scroll through thumbnails
   - Observe that thumbnails load progressively
   - Check browser DevTools Network tab to confirm lazy loading

2. **Keyboard Navigation:**
   - Tab through thumbnails
   - Press Enter on a thumbnail to open it
   - Use arrow keys in full-size view

3. **Touch Support (if testing on touch device):**
   - Swipe left/right to navigate images
   - Pinch to zoom on full-size images
   - Tap outside to close

### 4. Test Different Configurations

You can test with different JSON configurations:

1. **Default Gallery:**
   - Uses `config.json` with mixed placeholder and stock images
   - Tests various image sources and formats

2. **Product Gallery:**
   - Create a button that loads `product-gallery-example.json`
   - Tests different height settings and fixed height mode

### 5. Performance Testing

1. **Check Loading Performance:**
   - Open DevTools (F12)
   - Go to Network tab
   - Reload page and open gallery
   - Verify images load on-demand, not all at once

2. **Memory Usage:**
   - Open DevTools Performance tab
   - Record while scrolling through gallery
   - Check for memory leaks or excessive usage

## Common Issues and Solutions

### Gallery Doesn't Open

1. **Check Console for Errors:**
   - Press F12 to open DevTools
   - Look for red error messages in Console tab
   - Common error: "Failed to fetch" means server isn't running

2. **Verify Server is Running:**
   - Check terminal for "Serving HTTP on :: port 8000"
   - Try accessing http://localhost:8000 directly

3. **Check File Paths:**
   - Ensure all files are in the same directory
   - Verify config.json exists and is valid JSON

### Images Don't Load

1. **Check Image URLs:**
   - Open config.json and verify image URLs are valid
   - Test URLs directly in browser
   - Look for CORS errors in console

2. **Network Issues:**
   - Some placeholder services might be slow
   - Check DevTools Network tab for failed requests

### Styling Issues

1. **CSS Not Loading:**
   - Verify gallery-styles.css is in same directory
   - Check for CSS errors in console
   - Inspect elements to see if classes are applied

## Stopping the Server

To stop the web server:
1. Go to the terminal window running the server
2. Press `Ctrl + C` (Windows/Linux) or `Cmd + C` (Mac)
3. The server will shut down

## Alternative Testing Methods

### Using Other Web Servers

If Python is not available, you can use:

1. **Node.js http-server:**
   ```bash
   npm install -g http-server
   http-server -p 8000
   ```

2. **VS Code Live Server Extension:**
   - Install "Live Server" extension
   - Right-click on example.html
   - Select "Open with Live Server"

3. **XAMPP/WAMP/MAMP:**
   - Copy files to htdocs/www directory
   - Access via http://localhost/popup-gallery-widget/example.html

## Testing Checklist

- [ ] Gallery opens successfully
- [ ] All 4 demo buttons work
- [ ] Thumbnails load progressively (lazy loading)
- [ ] Click thumbnail shows full-size image
- [ ] Navigation arrows work
- [ ] Keyboard navigation works (ESC, arrows)
- [ ] Gallery closes properly (all methods)
- [ ] Responsive layout adjusts on window resize
- [ ] No console errors
- [ ] Performance is smooth

## Notes

- The server must remain running while testing
- Always use http://localhost:8000, not file:// URLs
- Clear browser cache if experiencing issues
- Test in multiple browsers for compatibility

## Support

If you encounter issues not covered in this guide:
1. Check the browser console for detailed error messages
2. Verify all files are present and paths are correct
3. Ensure you're accessing via http:// not file://
4. Try a different browser or incognito mode