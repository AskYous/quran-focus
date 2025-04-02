/**
 * Sets up the fullscreen toggle button and its event listeners.
 */
export function setupFullscreenToggle() {
  const fullscreenButton = document.getElementById('fullscreen-toggle');
  // Use querySelector which returns Element | null
  const fullscreenIcon = fullscreenButton?.querySelector('.fullscreen-icon');
  const exitFullscreenIcon = fullscreenButton?.querySelector('.exit-fullscreen-icon');

  // Ensure button and icons exist and are HTMLElements
  if (!(fullscreenButton instanceof HTMLElement) ||
    !(fullscreenIcon instanceof HTMLElement) ||
    !(exitFullscreenIcon instanceof HTMLElement)) {
    console.warn("Fullscreen button or icons not found or not HTMLElements.");
    if (fullscreenButton instanceof HTMLElement) {
      fullscreenButton.style.display = 'none'; // Hide button if elements are missing
    }
    return;
  }

  // Check for Fullscreen API support (with vendor prefixes)
  const doc = document;
  const docEl = document.documentElement;
  const isFullscreenSupported = doc.fullscreenEnabled ||
    // @ts-ignore - vendor prefixes
    doc.webkitFullscreenEnabled ||
    // @ts-ignore
    doc.mozFullScreenEnabled ||
    // @ts-ignore
    doc.msFullscreenEnabled;

  if (!isFullscreenSupported) {
    fullscreenButton.style.display = 'none'; // Hide button if not supported
    console.warn("Fullscreen API is not supported by this browser.");
    return;
  }

  function updateFullscreenIcon() {
    // Check current fullscreen element (with vendor prefixes)
    const fullscreenElement = doc.fullscreenElement ||
      // @ts-ignore
      doc.webkitFullscreenElement ||
      // @ts-ignore
      doc.mozFullScreenElement ||
      // @ts-ignore
      doc.msFullscreenElement;

    // Re-check elements are HTMLElement before accessing style/title
    if (!(fullscreenButton instanceof HTMLElement) ||
      !(fullscreenIcon instanceof HTMLElement) ||
      !(exitFullscreenIcon instanceof HTMLElement)) {
      return; // Should not happen if initial checks passed
    }

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
    const fullscreenElement = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;

    if (!fullscreenElement) {
      // Enter fullscreen (with vendor prefixes)
      const requestFullscreen = docEl.requestFullscreen ||
        // @ts-ignore
        docEl.webkitRequestFullscreen ||
        // @ts-ignore
        docEl.mozRequestFullScreen ||
        // @ts-ignore
        docEl.msRequestFullscreen;
      if (requestFullscreen) {
        requestFullscreen.call(docEl).catch(err => console.error(`FS Enter Error: ${err.message} (${err.name})`));
      }
    } else {
      // Exit fullscreen (with vendor prefixes)
      const exitFullscreen = doc.exitFullscreen ||
        // @ts-ignore
        doc.webkitExitFullscreen ||
        // @ts-ignore
        doc.mozCancelFullScreen ||
        // @ts-ignore
        doc.msExitFullscreen;
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
