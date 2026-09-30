/**
 * Mansur — Single Page Interactivity
 * Razor-Sharp Cutout Head & 4 Interactive Speech Bubbles
 */

document.addEventListener('DOMContentLoaded', () => {
  const mansurHead = document.getElementById('mansurHead');
  const mansurImg = document.getElementById('mansurImg');
  const bubbleStartup = document.getElementById('bubbleStartup');
  const bubbleBekorchi = document.getElementById('bubbleBekorchi');
  const bubbleWhatsUp = document.getElementById('bubbleWhatsUp');
  const bubbleBratim = document.getElementById('bubbleBratim');

  // ── Web Audio Synthesizer (Zero external dependencies) ──
  let audioCtx = null;

  function playPopSound(freqStart = 440, freqEnd = 800) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqStart, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (_) {}
  }

  // ── Mansur Head Click Reaction ──
  mansurHead?.addEventListener('click', () => {
    playPopSound(340, 720);
    mansurHead.classList.remove('clicked');
    void mansurHead.offsetWidth;
    mansurHead.classList.add('clicked');
    setTimeout(() => mansurHead.classList.remove('clicked'), 350);
  });

  // ── Speech Bubble Click Reaction & Wobble ──
  function triggerBubble(el, freq1, freq2) {
    playPopSound(freq1, freq2);
    el.classList.remove('wobble');
    void el.offsetWidth;
    el.classList.add('wobble');
    setTimeout(() => el.classList.remove('wobble'), 500);
  }

  bubbleStartup?.addEventListener('click', () => triggerBubble(bubbleStartup, 600, 950));
  bubbleBekorchi?.addEventListener('click', () => triggerBubble(bubbleBekorchi, 350, 650));
  bubbleWhatsUp?.addEventListener('click', () => triggerBubble(bubbleWhatsUp, 520, 920));
  bubbleBratim?.addEventListener('click', () => triggerBubble(bubbleBratim, 400, 780));

  // ── Corner Button Click Sounds ──
  document.querySelectorAll('.corner-btn').forEach(btn => {
    btn.addEventListener('click', () => playPopSound(480, 880));
  });

  // ── Cursor Glow & Ambient Parallax & Head Follow ──
  const cursorGlow = document.getElementById('cursorGlow');
  const doodles = document.querySelectorAll('.doodle');

  window.addEventListener('mousemove', (e) => {
    // 1. Move Cursor Glow
    if (cursorGlow) {
      cursorGlow.style.opacity = '1';
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    }

    if (window.innerWidth <= 860) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = (e.clientX - centerX) / centerX;
    const deltaY = (e.clientY - centerY) / centerY;

    // 2. Mansur Head 2D Crisp Parallax
    if (mansurImg) {
      const moveX = deltaX * 10;
      const moveY = deltaY * 8;
      const rot = deltaX * 2.5;
      mansurImg.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rot}deg)`;
    }

    // 3. Subtle Ambient Doodle Parallax
    doodles.forEach((doodle, i) => {
      const speed = (i % 3 + 1) * 6;
      doodle.style.transform = `translate(${deltaX * -speed}px, ${deltaY * -speed}px)`;
    });
  });

  window.addEventListener('mouseleave', () => {
    if (cursorGlow) cursorGlow.style.opacity = '0';
    if (mansurImg) mansurImg.style.transform = 'translate(0px, 0px) rotate(0deg)';
    doodles.forEach(doodle => doodle.style.transform = 'translate(0px, 0px)');
  });

  // ── Background Click Ripple Effect ──
  window.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });

  // ── Netlify Injected Elements & Drawer Auto-Purge ──
  const purgeNetlifyInjections = () => {
    document.querySelectorAll('netlify-drawer, #netlify-feedback, [data-netlify-deploy-id], iframe[src*="netlify"], div[class*="netlify-drawer"], .netlify-badge, #netlify-identity-widget').forEach(el => {
      try { el.remove(); } catch (_) {}
    });
  };
  purgeNetlifyInjections();
  const netlifyObserver = new MutationObserver(purgeNetlifyInjections);
  netlifyObserver.observe(document.documentElement, { childList: true, subtree: true });
});

