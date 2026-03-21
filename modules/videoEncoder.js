/**
 * Video encoder module — uses Web Codecs API + mp4-muxer to produce MP4.
 */

let mp4MuxerModule;

async function loadMp4Muxer() {
  if (mp4MuxerModule) return;
  mp4MuxerModule = await import('https://cdn.jsdelivr.net/npm/mp4-muxer@5/build/mp4-muxer.mjs');
}

/**
 * Creates an MP4 encoding session.
 * @param {object} options
 * @param {number} options.width - Video width (1080)
 * @param {number} options.height - Video height (1920)
 * @param {number} options.fps - Frames per second (30)
 * @param {number} options.sampleRate - Audio sample rate from decoded audio
 * @returns {Promise<object>} Encoder session with addFrame, addAudio, finalize, cancel methods
 */
export async function createEncoder({ width, height, fps, sampleRate }) {
  await loadMp4Muxer();
  const { Muxer, ArrayBufferTarget } = mp4MuxerModule;

  const target = new ArrayBufferTarget();

  const muxer = new Muxer({
    target,
    video: {
      codec: 'avc',
      width,
      height
    },
    audio: {
      codec: 'aac',
      numberOfChannels: 1,
      sampleRate
    },
    fastStart: 'in-memory'
  });

  let videoFrameCount = 0;
  let cancelled = false;
  const frameDuration = 1_000_000 / fps; // microseconds

  const videoEncoder = new VideoEncoder({
    output: (chunk, meta) => {
      if (!cancelled) muxer.addVideoChunk(chunk, meta);
    },
    error: (e) => console.error('VideoEncoder error:', e)
  });

  videoEncoder.configure({
    codec: 'avc1.42001f',
    width,
    height,
    bitrate: 2_000_000,
    framerate: fps
  });

  const audioEncoder = new AudioEncoder({
    output: (chunk, meta) => {
      if (!cancelled) muxer.addAudioChunk(chunk, meta);
    },
    error: (e) => console.error('AudioEncoder error:', e)
  });

  audioEncoder.configure({
    codec: 'mp4a.40.2',
    numberOfChannels: 1,
    sampleRate,
    bitrate: 128_000
  });

  return {
    /**
     * Adds a video frame from a canvas. Pauses if encoder queue is backed up.
     * @param {HTMLCanvasElement} canvas
     */
    async addFrame(canvas) {
      if (cancelled) return;

      // Backpressure: wait if encoder queue is too deep
      while (videoEncoder.encodeQueueSize > 10) {
        await new Promise(r => setTimeout(r, 1));
      }

      const frame = new VideoFrame(canvas, {
        timestamp: videoFrameCount * frameDuration
      });
      const keyFrame = videoFrameCount % (fps * 2) === 0; // keyframe every 2 seconds
      videoEncoder.encode(frame, { keyFrame });
      frame.close();
      videoFrameCount++;
    },

    /**
     * Adds audio data in chunks from a mono Float32Array.
     * @param {Float32Array} pcmData - Mono PCM samples
     * @param {number} sampleRate
     */
    addAudio(pcmData, sampleRate) {
      if (cancelled) return;
      // Feed audio in 1-second chunks to avoid overwhelming the encoder
      const chunkSize = sampleRate; // 1 second of samples
      for (let offset = 0; offset < pcmData.length; offset += chunkSize) {
        const end = Math.min(offset + chunkSize, pcmData.length);
        const chunk = pcmData.subarray(offset, end);
        const timestampUs = Math.round((offset / sampleRate) * 1_000_000);
        const audioData = new AudioData({
          format: 'f32-planar',
          sampleRate,
          numberOfFrames: chunk.length,
          numberOfChannels: 1,
          timestamp: timestampUs,
          data: chunk
        });
        audioEncoder.encode(audioData);
        audioData.close();
      }
    },

    /**
     * Finalizes encoding and returns the MP4 blob.
     * @returns {Promise<Blob>}
     */
    async finalize() {
      await videoEncoder.flush();
      await audioEncoder.flush();
      videoEncoder.close();
      audioEncoder.close();
      muxer.finalize();

      return new Blob([target.buffer], { type: 'video/mp4' });
    },

    /**
     * Cancels encoding and cleans up.
     */
    cancel() {
      cancelled = true;
      try { videoEncoder.close(); } catch (e) { /* already closed */ }
      try { audioEncoder.close(); } catch (e) { /* already closed */ }
    }
  };
}

/**
 * Checks if the browser supports video encoding with required codecs.
 * @returns {Promise<boolean>}
 */
export async function isVideoEncodingSupported() {
  if (typeof VideoEncoder === 'undefined' || typeof AudioEncoder === 'undefined') {
    return false;
  }
  try {
    const audioSupport = await AudioEncoder.isConfigSupported({
      codec: 'mp4a.40.2',
      sampleRate: 44100,
      numberOfChannels: 1,
      bitrate: 128_000
    });
    return audioSupport.supported === true;
  } catch {
    return false;
  }
}
