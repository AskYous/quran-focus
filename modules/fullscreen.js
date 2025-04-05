/**
 * Sets up the fullscreen toggle button and its event listeners.
 */
import { trackFullscreenToggle } from './analytics.js'; // Import analytics tracking

export function setupFullscreenToggle() {
  const fullscreenButton = document.getElementById('fullscreen-toggle');
  // Use querySelector which returns Element | null
  const fullscreenIcon = fullscreenButton?.querySelector('.fullscreen-icon');
  const exitFullscreenIcon = fullscreenButton?.querySelector('.exit-fullscreen-icon');

  // Ensure button and icons exist and are HTMLElements/Elements
  if (!(fullscreenButton instanceof HTMLElement) ||
    !(fullscreenIcon instanceof Element) || // Use Element for SVG
    !(exitFullscreenIcon instanceof Element)) { // Use Element for SVG
    console.warn("Fullscreen button or icons not found or not Elements.");
    if (fullscreenButton instanceof HTMLElement) {
      fullscreenButton.style.display = 'none'; // Hide button if elements are missing
    }
    return;
  }

  // Check for Fullscreen API support (with vendor prefixes)
  const doc = document;
  const docEl = document.documentElement;
  const isFullscreenSupported = doc.fullscreenEnabled ||
    // Use bracket notation for vendor prefixes
    doc['webkitFullscreenEnabled'] ||
    doc['mozFullScreenEnabled'] ||
    doc['msFullscreenEnabled'];

  if (!isFullscreenSupported) {
    fullscreenButton.style.display = 'none'; // Hide button if not supported
    console.warn("Fullscreen API is not supported by this browser.");
    return;
  }

  function updateFullscreenIcon() {
    // Check current fullscreen element (with vendor prefixes)
    // Use bracket notation for vendor prefixes
    const fullscreenElement = doc['fullscreenElement'] ||
      doc['webkitFullscreenElement'] ||
      doc['mozFullScreenElement'] ||
      doc['msFullscreenElement'];

    // Track the state change *after* checking the elements
    // This function is called by the 'fullscreenchange' event listener
    trackFullscreenToggle(!!fullscreenElement); // Convert element presence to boolean

    // Re-check elements are HTMLElement/Element before accessing style/title
    if (!(fullscreenButton instanceof HTMLElement) ||
      !(fullscreenIcon instanceof Element) || // Use Element for SVG
      !(exitFullscreenIcon instanceof Element)) { // Use Element for SVG
      return; // Should not happen if initial checks passed
    }

    // Accessing .style directly on Element
    // Relies on browser behavior or @ts-nocheck to work despite potential linter warning
    if (fullscreenElement) {
      fullscreenIcon.style.display = 'none';
      exitFullscreenIcon.style.display = 'block';
      fullscreenButton.title = "Exit Fullscreen";
    } else {
      fullscreenIcon.style.display = 'block';
      exitFullscreenIcon.style.display = 'none';
      fullscreenButton.title = "Enter Fullscreen";
    }
  }

  fullscreenButton.addEventListener('click', () => {
    // Use bracket notation for vendor prefixes
    const fullscreenElement = doc['fullscreenElement'] || doc['webkitFullscreenElement'] || doc['mozFullScreenElement'] || doc['msFullscreenElement'];

    if (!fullscreenElement) {
      // Enter fullscreen (with vendor prefixes)
      // Use bracket notation for vendor prefixes
      const requestFullscreen = docEl['requestFullscreen'] ||
        docEl['webkitRequestFullscreen'] ||
        docEl['mozRequestFullScreen'] ||
        docEl['msRequestFullscreen'];
      if (requestFullscreen) {
        requestFullscreen.call(docEl).catch(err => console.error(`FS Enter Error: ${err.message} (${err.name})`));
      }
    } else {
      // Exit fullscreen (with vendor prefixes)
      // Use bracket notation for vendor prefixes
      const exitFullscreen = doc['exitFullscreen'] ||
        doc['webkitExitFullscreen'] ||
        doc['mozCancelFullScreen'] ||
        doc['msExitFullscreen'];
      if (exitFullscreen) {
        exitFullscreen.call(doc).catch(err => console.error(`FS Exit Error: ${err.message} (${err.name})`));
      }
    }
  });

  // Listen for fullscreen change events (with vendor prefixes)
  doc.addEventListener('fullscreenchange', updateFullscreenIcon);
  doc.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
  doc.addEventListener('mozfullscreenchange', updateFullscreenIcon);
  doc.addEventListener('MSFullscreenChange', updateFullscreenIcon);

  // Set initial icon state
  updateFullscreenIcon();
  console.log("Fullscreen toggle initialized.");
}
