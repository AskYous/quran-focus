/**
 * Analytics module using Mixpanel for tracking user events
 * @ts-nocheck
 */

// Store mixpanel initialization status
let mixpanelInitialized = false;

/**
 * Initialize the Mixpanel analytics
 */
export function initializeAnalytics() {
  // --- Start Mixpanel Snippet ---
  (function (f, b) {
    // Access mixpanel via bracket notation to potentially avoid linter issues
    const mixpanelStub = window['mixpanel'] || [];
    if (!mixpanelStub.__SV) {
      var e, g, i, h;
      window['mixpanel'] = mixpanelStub; // Use bracket notation
      mixpanelStub._i = [];
      mixpanelStub.init = function (a, c, d) {
        function k(a, b) {
          var c = b.split(".");
          2 == c.length && (a = a[c[0]], b = c[1]);
          a[b] = function () {
            a.push([b].concat(Array.prototype.slice.call(arguments, 0)))
          }
        }
        var l = mixpanelStub;
        "undefined" !== typeof d ? l = mixpanelStub[d] = [] : d = "mixpanel";
        l.people = l.people || [];
        l.toString = function (a) {
          var b = "mixpanel";
          "mixpanel" !== d && (b += "." + d);
          a || (b += " (stub)");
          return b
        };
        l.people.toString = function () {
          return l.toString(1) + ".people (stub)"
        };
        i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
        for (h = 0; h < i.length; h++) k(l, i[h]);
        var j = "set set_once union append remove delete".split(" ");
        l.get_group = function () {
          function a(c) {
            b[c] = function () {
              // Declare vars used in this function scope
              var call2_args = arguments;
              var call2 = [c].concat(Array.prototype.slice.call(call2_args, 0));
              l.push([e, call2])
            }
          }
          // Declare b, c, e, d_inner in this scope
          var b = {}, c = ["get_group"].concat(Array.prototype.slice.call(arguments, 0)), e = c[0], d_inner = 1;
          for (; d_inner < c.length; d_inner++) a(c[d_inner]);
          return b
        };
        mixpanelStub._i.push([a, c, d])
      };
      mixpanelStub.__SV = 1.2;
      e = f.createElement("script");
      e.type = "text/javascript";
      e.async = !0;
      // Check for MIXPANEL_CUSTOM_LIB_URL environment variable using bracket notation
      var customLibUrl = window['MIXPANEL_CUSTOM_LIB_URL'];
      e.src = "undefined" !== typeof customLibUrl ? customLibUrl : "file:" === f.location.protocol && "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
      g = f.getElementsByTagName("script")[0];
      // Add null check for parentNode
      if (g && g.parentNode) {
        g.parentNode.insertBefore(e, g);
      } else {
        // Fallback if no script tag found (e.g., append to head)
        f.head.appendChild(e);
        console.warn("Mixpanel snippet could not find a script tag, appending to head.");
      }
    }
  })(document, window['mixpanel']); // Use bracket notation
  // --- End Mixpanel Snippet ---

  // Initialize with your project token
  // Use bracket notation for mixpanel access
  window['mixpanel'].init('6cd4475a79e7b676e8b441e6250ac45a', {
    debug: true, // Consider setting to false in production
    track_pageview: true, // The snippet handles the initial pageview track
    persistence: 'localStorage'
  });

  mixpanelInitialized = true;
  console.log('Mixpanel analytics initialized via snippet');

  // Note: The standard snippet with track_pageview: true automatically tracks the initial page view.
  // If you need to track subsequent page views (e.g., in a single-page application),
  // you can call trackPageView() manually upon navigation.
}

/**
 * Track a page view
 */
export function trackPageView() {
  // Use bracket notation for mixpanel access
  if (!window['mixpanel'] || !mixpanelInitialized) return;

  try {
    window['mixpanel'].track('Page View', {
      url: window.location.href,
      title: document.title
    });
  } catch (e) {
    console.error('Error tracking page view:', e);
  }
}

/**
 * Track a verse load event
 * @param {number} surahNumber The surah number
 * @param {number} ayahNumber The ayah number
 */
export function trackVerseLoad(surahNumber, ayahNumber) {
  // Use bracket notation for mixpanel access
  if (!window['mixpanel'] || !mixpanelInitialized) return;

  try {
    window['mixpanel'].track('Verse Load', {
      surah: surahNumber,
      ayah: ayahNumber,
      global_ayah: calculateGlobalAyahNumber(surahNumber, ayahNumber)
    });
  } catch (e) {
    console.error('Error tracking verse load:', e);
  }
}

/**
 * Track audio playback start
 * @param {number} surahNumber The surah number
 * @param {number} ayahNumber The ayah number
 */
export function trackAudioPlay(surahNumber, ayahNumber) {
  // Use bracket notation for mixpanel access
  if (!window['mixpanel'] || !mixpanelInitialized) return;

  try {
    window['mixpanel'].track('Audio Play', {
      surah: surahNumber,
      ayah: ayahNumber,
      global_ayah: calculateGlobalAyahNumber(surahNumber, ayahNumber)
    });
  } catch (e) {
    console.error('Error tracking audio play:', e);
  }
}

/**
 * Track audio playback pause
 * @param {number} surahNumber The surah number
 * @param {number} ayahNumber The ayah number
 */
export function trackAudioPause(surahNumber, ayahNumber) {
  // Use bracket notation for mixpanel access
  if (!window['mixpanel'] || !mixpanelInitialized) return;

  try {
    window['mixpanel'].track('Audio Pause', {
      surah: surahNumber,
      ayah: ayahNumber,
      global_ayah: calculateGlobalAyahNumber(surahNumber, ayahNumber)
    });
  } catch (e) {
    console.error('Error tracking audio pause:', e);
  }
}

/**
 * Track navigation events (next/previous ayah)
 * @param {string} direction The direction of navigation ('next' or 'previous')
 * @param {number} surahNumber The current surah number
 * @param {number} ayahNumber The current ayah number
 */
export function trackNavigation(direction, surahNumber, ayahNumber) {
  // Use bracket notation for mixpanel access
  if (!window['mixpanel'] || !mixpanelInitialized) return;

  try {
    window['mixpanel'].track('Navigation', {
      direction: direction,
      surah: surahNumber,
      ayah: ayahNumber,
      global_ayah: calculateGlobalAyahNumber(surahNumber, ayahNumber)
    });
  } catch (e) {
    console.error('Error tracking navigation:', e);
  }
}

/**
 * Track user selections from dropdowns
 * @param {number} surahNumber The selected surah number
 * @param {number} ayahNumber The selected ayah number
 */
export function trackSelection(surahNumber, ayahNumber) {
  // Use bracket notation for mixpanel access
  if (!window['mixpanel'] || !mixpanelInitialized) return;

  try {
    window['mixpanel'].track('Selection', {
      surah: surahNumber,
      ayah: ayahNumber,
      global_ayah: calculateGlobalAyahNumber(surahNumber, ayahNumber)
    });
  } catch (e) {
    console.error('Error tracking selection:', e);
  }
}

/**
 * Track onboarding events
 * @param {string} step The onboarding step
 * @param {string} action The action taken (start, next, prev, skip, finish)
 */
export function trackOnboarding(step, action) {
  // Use bracket notation for mixpanel access
  if (!window['mixpanel'] || !mixpanelInitialized) return;

  try {
    window['mixpanel'].track('Onboarding', {
      step: step,
      action: action
    });
  } catch (e) {
    console.error('Error tracking onboarding:', e);
  }
}

/**
 * Track settings changes
 * @param {string} setting The setting being changed
 * @param {any} value The new value
 */
export function trackSettingsChange(setting, value) {
  // Use bracket notation for mixpanel access
  if (!window['mixpanel'] || !mixpanelInitialized) return;

  try {
    window['mixpanel'].track('Settings Change', {
      setting: setting,
      value: value
    });
  } catch (e) {
    console.error('Error tracking settings change:', e);
  }
}

/**
 * Helper function to calculate global Ayah number
 * @param {number} surahNumber The surah number
 * @param {number} ayahNumber The ayah number
 * @returns {number} The global ayah number
 */
function calculateGlobalAyahNumber(surahNumber, ayahNumber) {
  // Import this from utils.js when integrating
  // For now providing a simple implementation
  const surahAyahCounts = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128,
    111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73,
    54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60,
    49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52,
    44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19,
    26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3,
    6, 3, 5, 4, 5, 6
  ];

  let globalAyah = 0;
  for (let i = 0; i < surahNumber - 1; i++) {
    globalAyah += surahAyahCounts[i];
  }
  globalAyah += ayahNumber;

  return globalAyah;
} 