export const transitionDuration = 3200;
// Same east-to-west orbit and centered half-area geometry as the native app.
export function celestialPosition(progress: number, rising: boolean, width: number, height: number) {
  const phase = Math.min(1, Math.max(0, progress));
  const start = rising ? Math.PI : Math.PI / 2;
  const end = rising ? Math.PI / 2 : 0;
  const angle = start + (end - start) * phase;
  return { x: width * (0.5 + 0.44 * Math.cos(angle)), y: height * (1.005 - 0.705 * Math.sin(angle)) };
}
function ease(phase: number) {
  // Invert the native timing curve's x coordinate: (0.35, 0, 0.25, 1).
  const t = Math.min(1, Math.max(0, phase));
  let low = 0, high = 1;
  for (let i = 0; i < 16; i++) {
    const p = (low + high) / 2;
    const x = 3 * (1 - p) ** 2 * p * 0.35 + 3 * (1 - p) * p ** 2 * 0.25 + p ** 3;
    if (x < t) low = p; else high = p;
  }
  const p = (low + high) / 2;
  return 3 * (1 - p) * p ** 2 + p ** 3;
}
export function createThemeTransition(canvas: HTMLCanvasElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const context = canvas.getContext('2d');
  let frame = 0;
  function stop() {
    cancelAnimationFrame(frame); frame = 0;
    canvas.hidden = true;
    delete canvas.dataset.transition;
    context?.clearRect(0, 0, canvas.width, canvas.height);
  }
  reduced.addEventListener('change', () => { if (reduced.matches) stop(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
  function play(appearance: 'light' | 'dark') {
    stop();
    if (!context || reduced.matches) return;
    const ctx = context;
    canvas.hidden = false;
    canvas.dataset.transition = appearance === 'light' ? 'sunrise' : 'sunset';
    const started = performance.now();
    function draw(now: number) {
      const elapsed = Math.max(0, now - started);
      if (elapsed >= transitionDuration) { stop(); return; }
      const p = ease(elapsed / (transitionDuration * 0.78));
      const fade = Math.min(1, elapsed / (transitionDuration * 0.14), (transitionDuration - elapsed) / (transitionDuration * 0.26));
      const width = canvas.clientWidth, height = canvas.clientHeight;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      const pixelsWide = Math.round(width * ratio), pixelsHigh = Math.round(height * ratio);
      if (canvas.width !== pixelsWide || canvas.height !== pixelsHigh) { canvas.width = pixelsWide; canvas.height = pixelsHigh; }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      canvas.style.opacity = String(Math.max(0, fade));
      const day = appearance === 'light' ? p : 1 - p;
      const mix = (night: number[], light: number[]) => night.map((v, i) => Math.round((v + (light[i] - v) * day) * 255));
      const sky = mix([0.14, 0.19, 0.31], [0.64, 0.72, 0.81]);
      const warmth = mix([0.35, 0.34, 0.47], [1, 0.68, 0.39]);
      const rgba = (rgb: number[], alpha: number) => `rgba(${rgb.join(',')},${alpha})`;
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      for (const [at, alpha] of [[0, 0], [0.28, 0.05], [0.63, 0.2], [1, 0.46]]) skyGradient.addColorStop(at, rgba(sky, alpha));
      ctx.fillStyle = skyGradient; ctx.fillRect(0, 0, width, height);
      const sun = celestialPosition(p, appearance === 'light', width, height);
      const moon = celestialPosition(p, appearance === 'dark', width, height);
      const radius = Math.min(52, height * 0.095), horizon = height * 0.9;
      const glow = ctx.createRadialGradient(sun.x, Math.min(sun.y, horizon), radius * 0.5, sun.x, Math.min(sun.y, horizon), height * 0.7);
      glow.addColorStop(0, rgba(warmth, 0.35)); glow.addColorStop(0.4, rgba(warmth, 0.13)); glow.addColorStop(1, rgba(warmth, 0));
      ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, width, horizon); ctx.clip();
      const disk = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, radius);
      disk.addColorStop(0, 'rgba(255,237,189,.92)'); disk.addColorStop(1, 'rgba(255,196,117,.78)');
      ctx.fillStyle = disk; ctx.beginPath(); ctx.arc(sun.x, sun.y, radius, 0, Math.PI * 2); ctx.fill();
      const mr = radius * 0.76;
      const moonGlow = ctx.createRadialGradient(moon.x, moon.y, mr * 0.8, moon.x, moon.y, mr * 2);
      moonGlow.addColorStop(0, 'rgba(199,217,255,.12)'); moonGlow.addColorStop(1, 'rgba(199,217,255,0)');
      ctx.fillStyle = moonGlow; ctx.beginPath(); ctx.arc(moon.x, moon.y, mr * 2, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(moon.x, moon.y, mr, 0, Math.PI * 2); ctx.clip();
      ctx.beginPath(); ctx.arc(moon.x, moon.y, mr, 0, Math.PI * 2); ctx.arc(moon.x + mr * 0.54, moon.y - mr * 0.3, mr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(224,235,255,.82)'; ctx.fill('evenodd'); ctx.restore(); ctx.restore();
      const horizonGlow = ctx.createLinearGradient(0, 0, 0, height);
      for (const [at, alpha] of [[0, 0], [0.64, 0], [0.85, 0.12], [0.94, 0.23], [1, 0.08]]) horizonGlow.addColorStop(at, rgba(warmth, alpha));
      ctx.fillStyle = horizonGlow; ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'destination-in';
      for (const vertical of [true, false]) {
        const mask = ctx.createLinearGradient(0, 0, vertical ? 0 : width, vertical ? height : 0);
        for (const [at, alpha] of [[0, 0], [vertical ? 0.17 : 0.08, 1], [vertical ? 0.83 : 0.92, 1], [1, 0]]) mask.addColorStop(at, `rgba(0,0,0,${alpha})`);
        ctx.fillStyle = mask; ctx.fillRect(0, 0, width, height);
      }
      ctx.globalCompositeOperation = 'source-over';
      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
  }
  return { play, stop };
}
