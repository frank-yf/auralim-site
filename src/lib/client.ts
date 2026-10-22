import { content, type Locale } from '../i18n/content';
import { appearanceAt, example, formatTime, offsetFromTrack, offsetInputText, offsetTrack, parseOffset, type Mode, type SolarEvent } from './demo';
import { createThemeTransition } from './transition';
const t = content[document.body.dataset.locale as Locale];
const get = <T extends Element>(selector: string) => document.querySelector<T>(selector)!;
const all = <T extends Element>(selector: string) => [...document.querySelectorAll<T>(selector)];
const timeline = get<HTMLInputElement>('#day-time');
const scene = get<HTMLElement>('.desktop');
const themeTransition = createThemeTransition(get<HTMLCanvasElement>('#theme-transition'));
let mode: Mode = 'auto';
const offsets = { sunrise: 0, sunset: 0 };
const drafts = { sunrise: 0, sunset: 0 };
function renderOffset(event: SolarEvent) {
  const value = drafts[event];
  const text = value === 0 ? t.onTime : document.body.dataset.locale === 'en' ? `${Math.abs(value)} ${t.minute} ${value < 0 ? t.earlier : t.later}` : `${value < 0 ? t.earlier : t.later} ${Math.abs(value)} ${t.minute}`;
  get<HTMLOutputElement>(`[data-offset-description="${event}"]`).value = text;
  const track = get<HTMLInputElement>(`[data-offset-track="${event}"]`);
  track.value = String(-value);
  track.setAttribute('aria-valuetext', text);
  const { position, base, color } = offsetTrack(value, event, document.documentElement.dataset.theme === 'dark');
  const start = Math.min(50, position), end = Math.max(50, position);
  const left = position < 50 ? color : base, right = position > 50 ? color : base;
  track.style.setProperty('--offset-color', color);
  track.style.setProperty('--offset-gradient', `linear-gradient(90deg, ${base} 0 ${start}%, ${left} ${start}%, ${right} ${end}%, ${base} ${end}% 100%)`);
}
function update() {
  const minutes = Number(timeline.value);
  const appearance = appearanceAt(minutes, offsets.sunrise, offsets.sunset, mode);
  scene.dataset.appearance = appearance;
  const progress = minutes / 1439;
  scene.style.setProperty('--solar-x', `${(progress - 0.5) * 95}px`);
  scene.style.setProperty('--solar-y', `${Math.cos(progress * Math.PI * 2) * 58}px`);
  all<HTMLElement>('[data-clock]').forEach(el => el.textContent = formatTime(minutes));
  get<HTMLOutputElement>('#demo-time').value = formatTime(minutes);
  timeline.setAttribute('aria-valuetext', `${formatTime(minutes)} · ${appearance === 'light' ? t.light : t.dark}`);
  get<HTMLElement>('[data-current-appearance]').textContent = appearance === 'light' ? t.light : t.dark;
  get<HTMLElement>('[data-mode-status]').textContent = mode === 'auto' ? t.autoStatus : mode === 'light' ? t.lightStatus : t.darkStatus;
  all<HTMLElement>('[data-rise]').forEach(el => el.textContent = formatTime(example.sunrise + offsets.sunrise));
  all<HTMLElement>('[data-set]').forEach(el => el.textContent = formatTime(example.sunset + offsets.sunset));
  for (const event of ['sunrise', 'sunset'] as const) renderOffset(event);
}
function selectMode(next: Mode, focus = false) {
  mode = next;
  all<HTMLButtonElement>('[data-mode]').forEach(button => {
    const selected = button.dataset.mode === next;
    button.setAttribute('aria-checked', String(selected)); button.tabIndex = selected ? 0 : -1;
    if (selected && focus) button.focus();
  }); update();
}
all<HTMLButtonElement>('[data-mode]').forEach((button,index) => {
  button.addEventListener('click', () => selectMode(button.dataset.mode as Mode));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
    selectMode((['light','auto','dark'] as const)[next], true);
  });
});
timeline.addEventListener('input', () => update());
for (const event of ['sunrise', 'sunset'] as const) {
  const track = get<HTMLInputElement>(`[data-offset-track="${event}"]`);
  const input = get<HTMLInputElement>(`[data-offset-input="${event}"]`);
  const error = get<HTMLElement>(`#${event}-error`);
  function clearError() { input.setAttribute('aria-invalid', 'false'); error.hidden = true; }
  function setDraft(value: number) {
    drafts[event] = value; input.value = offsetInputText(value); clearError(); renderOffset(event);
  }
  function commitDraft() { offsets[event] = drafts[event]; update(); }
  track.addEventListener('input', () => setDraft(offsetFromTrack(Number(track.value))));
  track.addEventListener('change', commitDraft);
  track.addEventListener('keydown', key => {
    if (!key.altKey || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key.key)) return;
    key.preventDefault();
    const direction = key.key === 'ArrowRight' || key.key === 'ArrowUp' ? 1 : -1;
    setDraft(offsetFromTrack(Number(track.value) + direction * 10)); commitDraft();
  });
  input.addEventListener('input', () => {
    const value = parseOffset(input.value);
    if (value !== null) { drafts[event] = value; clearError(); renderOffset(event); }
  });
  const commitText = () => {
    const value = parseOffset(input.value);
    if (value === null) { input.setAttribute('aria-invalid', 'true'); error.hidden = false; return; }
    setDraft(value); commitDraft();
  };
  input.addEventListener('blur', commitText);
  input.addEventListener('keydown', key => { if (key.key === 'Enter') { key.preventDefault(); commitText(); } });
  get<HTMLButtonElement>(`[data-reset-offset="${event}"]`).addEventListener('click', () => { setDraft(0); commitDraft(); });
}
all<HTMLButtonElement>('[data-jump]').forEach(button => button.addEventListener('click', () => {
  const event = button.dataset.jump as SolarEvent;
  timeline.value = String(example[event] + offsets[event]); selectMode('auto');
}));
const themeButton = get<HTMLButtonElement>('.theme-button');
function setTheme(dark: boolean, animate = false) {
  const changed = document.documentElement.dataset.theme !== (dark ? 'dark' : 'light');
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeButton.setAttribute('aria-pressed', String(dark));
  get<HTMLMetaElement>('meta[name="theme-color"]').content = dark ? '#171c27' : '#f7f6f2';
  const tab = tabs.find(button => button.dataset.galleryTab === (dark ? 'dark' : 'light'));
  if (tab) selectScreenshot(tab);
  for (const event of ['sunrise', 'sunset'] as const) renderOffset(event);
  if (animate && changed) themeTransition.play(dark ? 'dark' : 'light');
}
themeButton.addEventListener('click', () => { const dark = document.documentElement.dataset.theme !== 'dark'; setTheme(dark, true); try { localStorage.setItem('auralim-site-theme', dark ? 'dark' : 'light'); } catch {} });
const image = get<HTMLImageElement>('#app-screenshot');
const dialog = get<HTMLDialogElement>('#screenshot-dialog');
const tabs = all<HTMLButtonElement>('[data-gallery-tab]');
let gallerySelection = 0;
function selectScreenshot(button: HTMLButtonElement, focus = false) {
  tabs.forEach(tab => { const active = tab === button; tab.setAttribute('aria-selected',String(active)); tab.tabIndex = active ? 0 : -1; });
  const selection = ++gallerySelection;
  const screenshots = all<HTMLImageElement>('[data-gallery-image]');
  screenshots.forEach(screenshot => {
    screenshot.src = button.dataset.galleryTab === 'dark' ? screenshot.dataset.darkSrc! : screenshot.dataset.lightSrc!;
  });
  // Reveal the initial gallery only after its actual site-theme images decode.
  Promise.all(screenshots.map(screenshot => screenshot.decode().catch(() => {}))).then(() => {
    if (selection === gallerySelection) document.documentElement.dataset.galleryReady = 'true';
  });
  all<HTMLElement>('[data-gallery-panel]').forEach(panel => panel.setAttribute('aria-labelledby', button.id));
  if (focus) button.focus();
}
tabs.forEach((button, index) => {
  button.addEventListener('click', () => selectScreenshot(button));
  button.addEventListener('keydown', event => { if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return; event.preventDefault(); selectScreenshot(tabs[event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index], true); });
});
function showScreenshot(src: string, alt: string, caption: string, original = false) {
  const fullImage = get<HTMLImageElement>('#dialog-image');
  fullImage.src = src; fullImage.alt = alt;
  get('#dialog-caption').textContent = caption;
  get<HTMLElement>('#dialog-original').hidden = !original;
  dialog.setAttribute('aria-label', alt);
  dialog.showModal();
}
get('#open-app-icon').addEventListener('click', () => {
  const icon = get<HTMLImageElement>('#open-app-icon img');
  showScreenshot(icon.src, t.iconEnlarge, t.iconCaption, true);
});
get('#open-screenshot').addEventListener('click', () => showScreenshot(image.src, image.alt, t.galleryCaption));
get('#open-menu-screenshot').addEventListener('click', () => {
  const menu = get<HTMLImageElement>('.menu-shot img');
  showScreenshot(menu.src, menu.alt, t.menuCaption);
});
get('#close-screenshot').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
setTheme(document.documentElement.dataset.theme === 'dark');
update();
