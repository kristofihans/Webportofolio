import React, { useEffect, useRef } from 'react';
import './ScrollVideoHero.css';

// ── Build the list of 500 frame URLs via Vite's import.meta.glob ────────────
// Vite resolves these at build time — no runtime fetch needed
const frameModules = import.meta.glob(
  '../assets/frames/*.jpg',
  { eager: true, query: '?url', import: 'default' }
);

// Sort by filename so frames are in order 0001 → 0500
const FRAME_URLS = Object.keys(frameModules)
  .sort()
  .map((k) => frameModules[k]);

const TOTAL_FRAMES = FRAME_URLS.length; // 500

const ScrollVideoHero = () => {
  const canvasRef  = useRef(null);
  const wrapperRef = useRef(null);
  const overlayRef = useRef(null);
  const hintRef    = useRef(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const wrapper = wrapperRef.current;
    const overlay = overlayRef.current;
    const ctx     = canvas.getContext('2d');

    // ── Resize canvas to fill viewport ───────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrameIndex);
    };

    // ── Preload all frames into Image objects ─────────────────────────────
    // Images decode ahead of time so drawing is instant — no lag at all
    const images = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

    const onAllLoaded = () => {
      // Set wrapper height: 5px of scroll per frame
      const PX_PER_FRAME = 5;
      wrapper.style.height = `${window.innerHeight + TOTAL_FRAMES * PX_PER_FRAME}px`;
      drawFrame(0);
    };

    FRAME_URLS.forEach((url, i) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) onAllLoaded();
      };
      img.src = url;
      images[i] = img;
    });

    // ── Draw a single frame cover-fitted to canvas ────────────────────────
    let currentFrameIndex = 0;

    const drawFrame = (index) => {
      const img = images[index];
      if (!img || !img.complete || !img.naturalWidth) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Cover fit
      const scale  = Math.max(cw / iw, ch / ih);
      const dw     = iw * scale;
      const dh     = ih * scale;
      const dx     = (cw - dw) / 2;
      const dy     = (ch - dh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    // ── Scroll handler: map scroll → frame index ──────────────────────────
    let targetFrame    = 0;
    let displayedFrame = 0;
    let animDoneFired  = false;

    const handleScroll = () => {
      const scrollMax = wrapper.offsetHeight - window.innerHeight;
      const progress  = Math.min(Math.max(window.scrollY / scrollMax, 0), 1);
      targetFrame = Math.round(progress * (TOTAL_FRAMES - 1));

      // 1. Initial "Scroll" hint fades out quickly at the start
      if (hintRef.current) {
        hintRef.current.style.opacity = String(Math.max(0, 1 - progress * 15)); // Fades by ~6% scroll
      }

      // 2. Main Hero Overlay fades in starting at 50% scroll
      if (overlay) {
        const textProgress = Math.max(0, (progress - 0.50) / 0.20); // 0→1 over 50%–70%
        overlay.style.opacity = String(Math.min(1, textProgress));
      }

      // 3. Dispatch progress for Navbar sync
      window.dispatchEvent(new CustomEvent('heroScrollProgress', { detail: { progress } }));

      // 4. Fire a one-time event when animation finishes for Navbar BG
      if (progress >= 1 && !animDoneFired) {
        animDoneFired = true;
        window.dispatchEvent(new CustomEvent('heroAnimationDone'));
      }
      if (progress < 1 && animDoneFired) {
        animDoneFired = false;
        window.dispatchEvent(new CustomEvent('heroAnimationActive'));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resize);

    // ── RAF: snap to target frame (no lerp needed — drawing is instant) ───
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (displayedFrame !== targetFrame) {
        displayedFrame = targetFrame;
        currentFrameIndex = displayedFrame;
        drawFrame(displayedFrame);
      }
    };
    animate();

    // Initial size
    resize();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="hero-scroll-wrapper" ref={wrapperRef} id="hero">
      <div className="hero-sticky-area">
        {/* 2D canvas — instant frame draw, zero decode lag */}
        <canvas className="hero-canvas" ref={canvasRef} />

        {/* Vignette */}
        <div className="hero-vignette" />

        {/* Bottom fade into next section */}
        <div className="hero-bottom-fade" />

        {/* Initial "Scroll" hint — visible at the start, fades instantly */}
        <div className="hero-initial-hint" ref={hintRef}>
          <p>Scroll</p>
          <div className="hint-line" />
        </div>

        {/* Hero text — starts hidden, fades in during last 15% of animation */}
        <div className="hero-overlay" ref={overlayRef} style={{ opacity: 0 }}>
          <div className="container hero-center-content">
            <p className="greeting">Hello, I'm</p>
            <h1 className="hero-title">Hans</h1>
            <p className="hero-desc">
              A passionate web developer building powerful digital experiences —
              clean code, bold design, real results.
            </p>

            <div className="hero-stats">
              <div className="stat glass">
                <h3>10+</h3>
                <p>Projects Built</p>
              </div>
              <div className="stat glass">
                <h3>100%</h3>
                <p>Client Satisfaction</p>
              </div>
              <div className="stat glass">
                <h3>24h</h3>
                <p>Response Time</p>
              </div>
            </div>

            <div className="hero-actions">
              <a href="#portfolio" className="btn btn-primary">See My Work</a>
              <a href="#contact"   className="btn btn-outline">Let's Talk</a>
            </div>
          </div>

          <div className="hero-scroll-cue">
            <span>Scroll to explore</span>
            <div className="scroll-line" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollVideoHero;
