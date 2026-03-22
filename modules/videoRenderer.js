/**
 * Video renderer module — draws verse text with word-by-word animation on a canvas.
 */

const WIDTH = 720;
const HEIGHT = 1280;
const BG_COLOR = '#0f111a';
const ARABIC_FONT = '48px "Scheherazade New", "Amiri", serif';
const TRANSLATION_FONT = '26px "Lato", sans-serif';
const REFERENCE_FONT = '18px "Lato", sans-serif';
const WATERMARK_FONT = '14px "Lato", sans-serif';
const TEXT_COLOR = '#ffffff';
const TRANSLATION_COLOR = 'rgba(255, 255, 255, 0.6)';
const REFERENCE_COLOR = 'rgba(255, 255, 255, 0.5)';
const WATERMARK_COLOR = 'rgba(255, 255, 255, 0.2)';
const MAX_TEXT_WIDTH = 620;
const LINE_HEIGHT_ARABIC = 74;
const LINE_HEIGHT_TRANSLATION = 38;
const BLOCK_GAP = 36;
const FADE_DURATION = 0.3; // seconds

/**
 * Wraps text into lines that fit within maxWidth.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {string} font
 * @param {number} maxWidth
 * @returns {string[][]} Array of lines, each line is an array of words
 */
function wrapText(ctx, text, font, maxWidth) {
  ctx.font = font;
  const words = text.split(' ');
  const lines = [];
  let currentLine = [];
  let currentWidth = 0;

  for (const word of words) {
    const wordWidth = ctx.measureText(word + ' ').width;
    if (currentWidth + wordWidth > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [word];
      currentWidth = wordWidth;
    } else {
      currentLine.push(word);
      currentWidth += wordWidth;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Pre-computes layout for an ayah (line breaks, positions).
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} ayahData
 * @param {string} ayahData.arabic
 * @param {string} ayahData.translation
 * @param {string} ayahData.translationDirection
 * @param {string} ayahData.reference
 * @returns {object} Layout data
 */
export function computeLayout(ctx, ayahData) {
  const arabicLines = wrapText(ctx, ayahData.arabic, ARABIC_FONT, MAX_TEXT_WIDTH);
  const translationLines = wrapText(ctx, ayahData.translation, TRANSLATION_FONT, MAX_TEXT_WIDTH);

  const arabicHeight = arabicLines.length * LINE_HEIGHT_ARABIC;
  const translationHeight = translationLines.length * LINE_HEIGHT_TRANSLATION;
  const totalHeight = arabicHeight + BLOCK_GAP + translationHeight;

  // Vertical centering — shift up slightly so it feels balanced
  const startY = (HEIGHT - totalHeight) / 2 - 40;

  const arabicWords = arabicLines.flat();
  const translationWords = translationLines.flat();
  const totalWords = arabicWords.length + translationWords.length;

  return {
    arabicLines,
    translationLines,
    arabicWords,
    translationWords,
    totalWords,
    startY,
    arabicHeight,
    translationDirection: ayahData.translationDirection || 'ltr',
    reference: ayahData.reference
  };
}

/**
 * Draws a single frame of the ayah — all text shown at once.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} layout - From computeLayout
 * @param {number} opacity - Global opacity for fade in/out (0-1)
 */
export function drawFrame(ctx, layout, opacity) {
  // Clear and draw background
  ctx.globalAlpha = 1;
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.globalAlpha = opacity;

  // Draw Arabic text (RTL, centered)
  ctx.font = ARABIC_FONT;
  ctx.fillStyle = TEXT_COLOR;
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';

  let y = layout.startY;
  for (const line of layout.arabicLines) {
    ctx.fillText(line.join(' '), WIDTH / 2, y);
    y += LINE_HEIGHT_ARABIC;
  }

  // Draw translation text
  y = layout.startY + layout.arabicHeight + BLOCK_GAP;
  ctx.font = TRANSLATION_FONT;
  ctx.fillStyle = TRANSLATION_COLOR;
  ctx.direction = layout.translationDirection === 'rtl' ? 'rtl' : 'ltr';
  ctx.textAlign = 'center';

  for (const line of layout.translationLines) {
    ctx.fillText(line.join(' '), WIDTH / 2, y);
    y += LINE_HEIGHT_TRANSLATION;
  }

  // Draw ayah reference
  ctx.font = REFERENCE_FONT;
  ctx.fillStyle = REFERENCE_COLOR;
  ctx.direction = 'ltr';
  ctx.textAlign = 'center';
  ctx.fillText(layout.reference, WIDTH / 2, HEIGHT - 120);

  // Draw watermark
  ctx.font = WATERMARK_FONT;
  ctx.fillStyle = WATERMARK_COLOR;
  ctx.textAlign = 'right';
  ctx.fillText('Quran Focus', WIDTH - 40, HEIGHT - 40);

  ctx.globalAlpha = 1;
  ctx.direction = 'ltr';
}

/**
 * Renders all frames for a single ayah and feeds them to the encoder.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} layout - From computeLayout
 * @param {number} audioDuration - Duration in seconds for this ayah
 * @param {number} fps
 * @param {object} encoder - From createEncoder
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<number>} Total frames rendered for this ayah
 */
export async function renderAyahFrames(ctx, layout, audioDuration, fps, encoder, canvas) {
  const totalFrames = Math.round(audioDuration * fps);
  const fadeFrames = Math.round(FADE_DURATION * fps);
  let framesRendered = 0;
  let lastOpacity = -1;

  for (let f = 0; f < totalFrames; f++) {
    // Calculate opacity for fade in/out
    let opacity = 1;
    if (f < fadeFrames) {
      opacity = f / fadeFrames;
    } else if (f >= totalFrames - fadeFrames) {
      opacity = (totalFrames - f) / fadeFrames;
    }

    // Only redraw canvas when opacity changes (skip during static hold)
    if (opacity !== lastOpacity) {
      drawFrame(ctx, layout, opacity);
      lastOpacity = opacity;
    }

    // Feed the same canvas to encoder (unchanged pixels = tiny encoded frame)
    await encoder.addFrame(canvas);
    framesRendered++;
  }

  return framesRendered;
}

/**
 * Ensures required fonts are loaded for canvas rendering.
 */
export async function ensureFontsLoaded() {
  await document.fonts.load('48px "Scheherazade New"');
  await document.fonts.load('26px "Lato"');
  await document.fonts.ready;
}
