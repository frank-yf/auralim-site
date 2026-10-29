export const transitionDuration = 3200;
// Keep both bodies within the dense inner sky, including their full disks on narrow screens.
export function celestialRadius(height: number) { return Math.min(60, height * 0.105); }
export function celestialPosition(progress: number, rising: boolean, width: number, height: number) {
  const phase = Math.min(1, Math.max(0, progress));
  const start = rising ? Math.PI : Math.PI / 2;
  const end = rising ? Math.PI / 2 : 0;
  const angle = start + (end - start) * phase;
  const radius = celestialRadius(height);
  const horizontalReach = Math.max(0, Math.min(width * 0.25, width * 0.26 - radius));
  return { x: width * 0.5 + horizontalReach * Math.cos(angle), y: height * (0.72 - 0.22 * Math.sin(angle)) };
}
// Compact screens use a full-width middle band rather than a compressed orbit.
export function compactCelestialRadius(width: number, height: number) {
  return Math.min(60, width * 0.13, height * 0.22);
}
export function compactCelestialPosition(progress: number, rising: boolean, width: number, height: number) {
  const phase = Math.min(1, Math.max(0, progress));
  const radius = compactCelestialRadius(width, height);
  const from = rising ? -radius * 1.5 : width * 0.5;
  const to = rising ? width * 0.5 : width + radius * 1.5;
  return { x: from + (to - from) * phase, y: height * 0.5 };
}
// Trace the crescent as one contour. Clipping two even-odd disks leaves an
// antialiased full-circle seam along the otherwise transparent cutout.
export function crescentPath(x: number, y: number, radius: number) {
  const dx = radius * 0.54, dy = -radius * 0.30;
  const direction = Math.atan2(dy, dx);
  const angle = Math.acos(Math.hypot(dx, dy) / (2 * radius));
  const path = new Path2D();
  path.arc(x, y, radius, direction - angle, direction + angle, true);
  path.arc(x + dx, y + dy, radius, direction + Math.PI - angle, direction + Math.PI + angle);
  path.closePath();
  return path;
}
// Render the diffuse mask once at quarter resolution, then reuse it each frame.
// A broad opacity falloff plus a real blur avoids a solid-looking dome edge.
function createSkyDomeMask(width: number, height: number) {
  const mask = document.createElement('canvas');
  mask.width = Math.max(1, Math.ceil(width * 0.25));
  mask.height = Math.max(1, Math.ceil(height * 0.25));
  const ctx = mask.getContext('2d');
  if (!ctx) return mask;
  const blur = Math.min(100, Math.max(28, Math.min(width, height) * 0.10));
  ctx.filter = `blur(${blur * 0.25}px)`;
  ctx.translate(mask.width * 0.5, mask.height);
  ctx.scale(mask.width * 0.52, mask.height * 0.98);
  const fade = ctx.createRadialGradient(0, 0, 0, 0, 0, 1.35);
  for (const [radius, alpha] of [[0, 1], [0.24, 1], [0.45, 0.94], [0.65, 0.80],
    [0.80, 0.56], [1, 0.27], [1.15, 0.10], [1.35, 0]]) {
    fade.addColorStop(radius / 1.35, `rgba(0,0,0,${alpha})`);
  }
  ctx.fillStyle = fade;
  ctx.fillRect(-2, -2, 4, 4);
  return mask;
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
  const compactScreen = matchMedia('(max-width: 570px)');
  const context = canvas.getContext('2d');
  let frame = 0;
  let skyMask: { width: number; height: number; canvas: HTMLCanvasElement } | undefined;
  let completion: (() => void) | undefined;
  function stop() {
    cancelAnimationFrame(frame); frame = 0;
    completion = undefined;
    canvas.hidden = true;
    delete canvas.dataset.transition;
    context?.clearRect(0, 0, canvas.width, canvas.height);
  }
  function finish() {
    const commit = completion;
    stop();
    commit?.();
  }
  reduced.addEventListener('change', () => { if (reduced.matches) finish(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) finish(); });
  window.addEventListener('pagehide', finish);
  function play(appearance: 'light' | 'dark', onComplete: () => void) {
    stop();
    if (!context || reduced.matches || document.hidden) { onComplete(); return; }
    completion = onComplete;
    const ctx = context;
    canvas.hidden = false;
    canvas.dataset.transition = appearance === 'light' ? 'sunrise' : 'sunset';
    const started = performance.now();
    function draw(now: number) {
      const elapsed = Math.max(0, now - started);
      if (elapsed >= transitionDuration) { finish(); return; }
      // Let the initial night/day scene establish itself before the orbit
      // moves; both the sky and the visible body then reach the final scene.
      const travel = Math.min(1, Math.max(0, (elapsed / transitionDuration - 0.12) / 0.60));
      const p = ease(travel);
      const skyProgress = travel * travel * (3 - 2 * travel);
      const fade = Math.min(1, elapsed / (transitionDuration * 0.14), (transitionDuration - elapsed) / (transitionDuration * 0.26));
      const width = canvas.clientWidth, height = canvas.clientHeight;
      const compact = compactScreen.matches;
      const position = compact ? compactCelestialPosition : celestialPosition;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      const pixelsWide = Math.round(width * ratio), pixelsHigh = Math.round(height * ratio);
      if (canvas.width !== pixelsWide || canvas.height !== pixelsHigh) { canvas.width = pixelsWide; canvas.height = pixelsHigh; }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      // Let more of the page show through the enlarged sky throughout the effect.
      canvas.style.opacity = String(Math.max(0, fade) * 0.78);
      const day = appearance === 'light' ? skyProgress : 1 - skyProgress;
      const visibility = (value: number) => {
        const phase = Math.min(1, Math.max(0, (value - 0.06) / 0.72));
        return phase * phase * (3 - 2 * phase);
      };
      const sunlight = visibility(day), moonlight = visibility(1 - day);
      const mix = (night: number[], light: number[]) => night.map((v, i) => Math.round((v + (light[i] - v) * day) * 255));
      const zenith = mix([0.065, 0.095, 0.18], [0.45, 0.66, 0.86]);
      const sky = mix([0.14, 0.19, 0.31], [0.64, 0.78, 0.90]);
      const horizonSky = mix([0.26, 0.29, 0.40], [0.94, 0.85, 0.71]);
      const warmth = mix([0.35, 0.34, 0.47], [1, 0.68, 0.39]);
      const rgba = (rgb: number[], alpha: number) => `rgba(${rgb.join(',')},${alpha})`;
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      // The whole central sky carries the transition, with only the outer
      // mask fading into the page. It remains legible on white windows.
      skyGradient.addColorStop(0, rgba(zenith, 0.96));
      skyGradient.addColorStop(0.55, rgba(sky, 0.96));
      skyGradient.addColorStop(1, rgba(horizonSky, 0.94));
      ctx.fillStyle = skyGradient; ctx.fillRect(0, 0, width, height);
      const sun = position(p, appearance === 'light', width, height);
      // Preserve the slight atmosphere lead within the new scene timeline.
      const moonPhase = appearance === 'dark'
        ? ease(Math.max(0, travel - 0.045) / 0.955) : p;
      const moon = position(moonPhase, appearance === 'dark', width, height);
      const moonAtmosphere = position(p, appearance === 'dark', width, height);
      const radius = compact ? compactCelestialRadius(width, height) : celestialRadius(height);
      const horizon = height * 0.9;
      const glow = ctx.createRadialGradient(sun.x, Math.min(sun.y, horizon), radius * 0.5, sun.x, Math.min(sun.y, horizon), height * 0.7);
      glow.addColorStop(0, rgba(warmth, 0.35 * sunlight)); glow.addColorStop(0.4, rgba(warmth, 0.13 * sunlight)); glow.addColorStop(1, rgba(warmth, 0));
      ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
      const mr = radius * 0.76;
      const nightVeil = ctx.createRadialGradient(moonAtmosphere.x, moonAtmosphere.y, 0,
        moonAtmosphere.x, moonAtmosphere.y, mr * 4.8);
      const nightStrength = moonlight;
      nightVeil.addColorStop(0, `rgba(43,60,91,${0.28 * nightStrength})`);
      nightVeil.addColorStop(0.28, `rgba(53,71,104,${0.20 * nightStrength})`);
      nightVeil.addColorStop(0.65, `rgba(64,83,118,${0.07 * nightStrength})`);
      nightVeil.addColorStop(1, 'rgba(64,83,118,0)');
      ctx.fillStyle = nightVeil; ctx.fillRect(0, 0, width, height);
      const horizonGlow = ctx.createLinearGradient(0, 0, 0, height);
      for (const [at, alpha] of [[0, 0], [0.64, 0], [0.85, 0.12], [0.94, 0.23], [1, 0.08]]) horizonGlow.addColorStop(at, rgba(warmth, alpha));
      ctx.fillStyle = horizonGlow; ctx.fillRect(0, 0, width, height);
      if (!compact) {
        if (!skyMask || skyMask.width !== width || skyMask.height !== height) {
          skyMask = { width, height, canvas: createSkyDomeMask(width, height) };
        }
        ctx.save();
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(skyMask.canvas, 0, 0, width, height);
        ctx.restore();
      }
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, width, horizon); ctx.clip();
      ctx.globalAlpha = sunlight;
      const disk = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, radius);
      disk.addColorStop(0, 'rgba(255,237,189,.92)'); disk.addColorStop(1, 'rgba(255,196,117,.78)');
      ctx.fillStyle = disk; ctx.beginPath(); ctx.arc(sun.x, sun.y, radius, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = moonlight;
      const moonGlow = ctx.createRadialGradient(moon.x, moon.y, mr * 0.8, moon.x, moon.y, mr * 1.8);
      moonGlow.addColorStop(0, 'rgba(185,204,235,.06)'); moonGlow.addColorStop(1, 'rgba(185,204,235,0)');
      ctx.fillStyle = moonGlow; ctx.beginPath(); ctx.arc(moon.x, moon.y, mr * 1.8, 0, Math.PI * 2); ctx.fill();
      const crescent = crescentPath(moon.x, moon.y, mr);
      const moonSurface = ctx.createLinearGradient(moon.x - mr, moon.y - mr, moon.x + mr, moon.y + mr);
      moonSurface.addColorStop(0, 'rgba(232,239,250,.97)');
      moonSurface.addColorStop(0.5, 'rgba(212,224,243,.97)');
      moonSurface.addColorStop(1, 'rgba(178,197,224,.96)');
      // Both the soft edge and the stroke follow this one crescent contour.
      ctx.shadowColor = 'rgba(51,70,105,.28)'; ctx.shadowBlur = mr * 0.12;
      ctx.fillStyle = moonSurface; ctx.fill(crescent);
      ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(66,87,123,.42)'; ctx.lineWidth = 0.8;
      ctx.stroke(crescent); ctx.restore();
      ctx.globalCompositeOperation = 'destination-in';
      for (const vertical of compact ? [true] : [true, false]) {
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
