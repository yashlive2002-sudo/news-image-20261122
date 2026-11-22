// build.mjs: draws THE WORLD TODAY front page for one day from news.json.
//
//   node build.mjs            writes design/front.html, then renders it to entry.png (1024x1024)
//
// The page is laid out in HTML and screenshotted by a local Chromium-based browser (Edge or Chrome),
// headless. Rendering happens only here, on the author's machine: main.ts copies the committed
// entry.png, so the graded program needs no browser and no network and writes the same bytes every run.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const news = JSON.parse(readFileSync(join(root, 'news.json'), 'utf8'));

// Short bodies (about 100 characters each), cut from news.json's longer ones without adding facts.
// Keyed by headline; a story with no entry here keeps its own body.
const SHORT_BODY = {
  'TRIPLE-TAP ON KRYVYI RIH': "Missiles, then drones, hit rescuers in Zelenskyy's hometown. A boy, 7, and a paramedic were killed.",
  'RUSSIAN SHIP ABLAZE': 'Ukrainian drones set the sanctioned Russian cargo ship Sparta II ablaze in the Gulf of Finland.',
  'CLIMATE TALKS DEADLOCKED': 'Talks in Antalya reach their final day deadlocked over fossil fuels as nations push for a stronger deal.',
  'IRAN HITS 3 TANKERS': 'Iran strikes three tankers and shows off missile launchers; Houthis fire revenge strikes on Riyadh.',
  'QUAKE HITS PERU': 'A magnitude 6.7 earthquake strikes Peru. No deaths have been reported.',
};

const THEME = {
  dip: '#b3201b', // war and diplomacy
  me: '#c25a0c', // Middle East
  sci: '#1d6b5c', // climate, science, nature
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// The lead deck carries <strong> from news.json: keep that tag alone, escape everything else.
const deckHtml = (s) => esc(s).replace(/&lt;(\/?)strong&gt;/g, '<$1strong>');

const { lead, stories, index, dateLong, footerRegions } = news;

const storyCell = (s) => `
  <article class="story" style="--c:${THEME[s.theme] ?? THEME.dip}">
    <div class="kicker">${esc(s.kicker)}</div>
    <div class="big" style="font-size:${s.bigSize ?? 50}px">${esc(s.big)}</div>
    <h3>${esc(s.headline)}</h3>
    <p>${esc(SHORT_BODY[s.headline] ?? s.body)}</p>
  </article>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>THE WORLD TODAY · ${esc(dateLong)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1024px; height: 1024px; overflow: hidden; }
  body { background: #f6f1e4; color: #161412; font-family: Georgia, 'Times New Roman', serif; padding: 22px 28px 0; }
  .ear { display: flex; justify-content: space-between; font: 700 12px Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #4a443c; }
  .mast { text-align: center; font: 900 78px/1 Georgia, 'Times New Roman', serif; letter-spacing: .03em; white-space: nowrap; margin: 4px 0 8px; }
  .rule2 { border-top: 3px solid #161412; border-bottom: 1px solid #161412; height: 6px; }
  .dateline { display: flex; justify-content: space-between; align-items: center; padding: 7px 2px; border-bottom: 1px solid #161412; font: 700 13px Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; }
  .dateline .day { font: 700 22px Georgia, serif; letter-spacing: .06em; }
  .lead { padding: 14px 0 14px; border-bottom: 3px solid #161412; }
  .lead .kicker { color: ${THEME.dip}; }
  .lead h1 { font: 400 104px/0.95 Impact, 'Arial Narrow', 'Arial Black', sans-serif; letter-spacing: .01em; margin: 4px 0 10px; }
  .lead .row { display: flex; gap: 22px; align-items: stretch; }
  .deck { flex: 1 1 0; font-size: 21px; line-height: 1.3; }
  .deck strong { color: ${THEME.dip}; }
  .stats { display: flex; gap: 0; flex: 0 0 486px; }
  .stat { flex: 1; text-align: center; border-left: 1px solid #161412; padding: 0 6px; }
  .stat b { display: block; font: 400 78px/1 Impact, 'Arial Narrow', sans-serif; color: ${THEME.dip}; }
  .stat span { display: block; font: 700 13px/1.2 Arial, sans-serif; text-transform: uppercase; letter-spacing: .06em; margin-top: 4px; }
  .kicker { font: 700 12px Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: var(--c); }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: 266px 266px; }
  .story, .index { padding: 12px 14px 10px; border-right: 1px solid #161412; border-bottom: 1px solid #161412; overflow: hidden; }
  .grid > :nth-child(3n) { border-right: 0; }
  .grid > :nth-child(3n+1) { padding-left: 0; }
  .grid > :nth-child(3n) { padding-right: 0; }
  .story .big { font-family: Impact, 'Arial Narrow', sans-serif; line-height: 1; color: var(--c); margin: 4px 0 4px; }
  .story h3 { font: 700 18.5px/1.15 Georgia, serif; margin-bottom: 7px; }
  .story p { font-size: 18px; line-height: 1.36; }
  .index h2 { font: 700 13px Arial, sans-serif; letter-spacing: .18em; text-transform: uppercase; border-bottom: 2px solid #161412; padding-bottom: 5px; margin-bottom: 4px; }
  .index ol { list-style: none; counter-reset: i; }
  .index li { counter-increment: i; font-size: 16.5px; line-height: 1.2; padding: 8.5px 0 8.5px 26px; position: relative; border-bottom: 1px dotted #8b8378; }
  .index li:last-child { border-bottom: 0; }
  .index li::before { content: counter(i); position: absolute; left: 0; top: 3px; font: 400 18px Impact, sans-serif; color: ${THEME.dip}; }
  footer { display: flex; justify-content: space-between; padding: 9px 2px 0; font: 700 12px Arial, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #4a443c; }
</style></head>
<body>
  <div class="ear"><span>World edition</span><span>One day · one page</span></div>
  <div class="mast">THE WORLD TODAY</div>
  <div class="rule2"></div>
  <div class="dateline"><span>The day's world news</span><span class="day">${esc(dateLong)}</span><span>Issue of 22 · 11 · 2026</span></div>

  <section class="lead">
    <div class="kicker">${esc(lead.kicker)}</div>
    <h1>${esc(lead.headline)}</h1>
    <div class="row">
      <p class="deck">${deckHtml(lead.deck)}</p>
      <div class="stats">${lead.stats.map((s) => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</div>
    </div>
  </section>

  <section class="grid">
    ${stories.map(storyCell).join('')}
    <aside class="index">
      <h2>Index · ${esc(dateLong.split(',')[0])}</h2>
      <ol>${index.map((line) => `<li>${esc(line)}</li>`).join('')}</ol>
    </aside>
  </section>

  <footer><span>${esc(footerRegions)}</span><span>The news of ${esc(dateLong)}</span></footer>
</body></html>
`;

const designDir = join(root, 'design');
mkdirSync(designDir, { recursive: true });
const page = join(designDir, 'front.html');
writeFileSync(page, html);

const browser = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/chromium',
  '/usr/bin/google-chrome',
].filter(Boolean).find((p) => existsSync(p));
if (!browser) throw new Error('no Chromium-based browser found: set BROWSER=<path>');

const png = join(root, 'entry.png');
execFileSync(browser, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--force-device-scale-factor=1', '--window-size=1024,1024',
  `--screenshot=${png}`, pathToFileURL(page).href,
], { stdio: 'ignore' });

const bytes = readFileSync(png);
const w = bytes.readUInt32BE(16);
const h = bytes.readUInt32BE(20);
console.log(`entry.png: ${w}x${h}, ${bytes.length} bytes`);
if (w > 1024 || h > 1024 || bytes.length > 1048576) throw new Error('entry.png breaks the gate limits');
