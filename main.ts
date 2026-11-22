// THE WORLD TODAY, Sunday 22 November 2026: make.fun entry point (Node 22, standard library only).
//
// The front page is drawn ahead of time from news.json by build.mjs and committed as entry.png.
// This program copies those bytes to /output/entry.png, so it needs no network and every run
// writes exactly the same image.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MAX_BYTES = 1048576; // the gate: at most 1 MiB
const MAX_SIDE = 1024; // the gate: at most 1024 x 1024 pixels
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const png = readFileSync(new URL('./entry.png', import.meta.url));

// Refuse here, loudly, any image the gate would mark invalid.
if (!png.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error('entry.png is not a PNG');
if (png.length > MAX_BYTES) throw new Error(`entry.png is ${png.length} bytes, over ${MAX_BYTES}`);
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
if (width > MAX_SIDE || height > MAX_SIDE) throw new Error(`entry.png is ${width}x${height}, over ${MAX_SIDE}x${MAX_SIDE}`);
if (png.subarray(png.length - 8, png.length - 4).toString('latin1') !== 'IEND') throw new Error('entry.png is cut short (no IEND chunk)');

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
// mode 0644: the grader may collect /output as a different user from the one this runs as.
writeFileSync(join(outDir, 'entry.png'), png, { mode: 0o644 });
