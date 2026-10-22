import { content, type Locale } from '../i18n/content';
import { appearanceAt, clampOffset, example, formatTime, offsetFromTrack, type Mode } from './demo';
const t = content[document.body.dataset.locale as Locale];
const get = <T extends Element>(selector: string) => document.querySelector<T>(selector)!;
const all = <T extends Element>(selector: string) => [...document.querySelectorAll<T>(selector)];
const timeline = get<HTMLInputElement>('#day-time');
const scene = get<HTMLElement>('.desktop');
let mode: Mode = 'auto';
const offsets = { sunrise: 0, sunset: 0 };
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
  for (const event of ['sunrise','sunset'] as const) {
    const value = offsets[event];
    const text = value === 0 ? t.onTime : document.body.dataset.locale === 'en' ? `${Math.abs(value)} ${t.minute} ${value < 0 ? t.earlier : t.later}` : `${value < 0 ? t.earlier : t.later} ${Math.abs(value)} ${t.minute}`;
    get<HTMLOutputElement>(`[data-offset-description="${event}"]`).value = text;
    const track = get<HTMLInputElement>(`[data-offset-track="${event}"]`);
    track.value = String(-value);
    track.setAttribute('aria-valuetext', text);
    track.style.setProperty('--range-start', `${Math.min(50, 50 - value / 2.4)}%`);
    track.style.setProperty('--range-end', `${Math.max(50, 50 - value / 2.4)}%`);
  }
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
timeline.addEventListener('input', update);
for (const event of ['sunrise','sunset'] as const) {
  const track = get<HTMLInputElement>(`[data-offset-track="${event}"]`);
  const input = get<HTMLInputElement>(`[data-offset-input="${event}"]`);
  track.addEventListener('input', () => { offsets[event] = offsetFromTrack(Number(track.value)); input.value = String(offsets[event]); update(); });
  const commit = () => {
    const value = Number(input.value);
    offsets[event] = clampOffset(Number.isFinite(value) ? value : 0);
    input.value = String(offsets[event]); update();
  };
  input.addEventListener('change', commit);
  input.addEventListener('keydown', key => { if (key.key === 'Enter') { commit(); input.blur(); } });
}
get('#reset-offsets').addEventListener('click', () => {
  offsets.sunrise = offsets.sunset = 0;
  all<HTMLInputElement>('[data-offset-input]').forEach(input => input.value = '0'); update();
});
all<HTMLButtonElement>('[data-jump]').forEach(button => button.addEventListener('click', () => {
  const event = button.dataset.jump as keyof typeof example;
  timeline.value = String(example[event] + offsets[event]); selectMode('auto');
}));
const themeButton = get<HTMLButtonElement>('.theme-button');
function setTheme(dark: boolean) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeButton.setAttribute('aria-pressed', String(dark));
  get<HTMLMetaElement>('meta[name="theme-color"]').content = dark ? '#171c27' : '#f7f6f2';
  const tab = tabs.find(button => button.dataset.galleryTab === (dark ? 'dark' : 'light'));
  if (tab) selectScreenshot(tab);
}
themeButton.addEventListener('click', () => { const dark = document.documentElement.dataset.theme !== 'dark'; setTheme(dark); try { localStorage.setItem('auralim-site-theme', dark ? 'dark' : 'light'); } catch {} });
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
function showScreenshot(src: string, alt: string, caption: string) {
  const fullImage = get<HTMLImageElement>('#dialog-image');
  fullImage.src = src; fullImage.alt = alt;
  get('#dialog-caption').textContent = caption;
  dialog.showModal();
}
get('#open-screenshot').addEventListener('click', () => showScreenshot(image.src, image.alt, t.galleryCaption));
get('#open-menu-screenshot').addEventListener('click', () => {
  const menu = get<HTMLImageElement>('.menu-shot img');
  showScreenshot(menu.src, menu.alt, t.menuCaption);
});
get('#close-screenshot').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
setTheme(document.documentElement.dataset.theme === 'dark');
update();
