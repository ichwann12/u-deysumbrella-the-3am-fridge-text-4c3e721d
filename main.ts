// The 3AM Fridge Text — make.fun bounty entry.
//
// Reads the single line from entry.txt at the repository root and writes it
// verbatim to <output dir>/entry.txt. Node 22, standard library only, no
// network, no wall clock, fully deterministic.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const raw = readFileSync(join(BOT_DIR, 'entry.txt'), 'utf8');
// Strip only the file's trailing newline(s) so the output is byte-for-byte
// the line itself, with no trailing newline counted against the 140 cap.
const line = raw.replace(/[\r\n]+$/, '');

if (line.length === 0) {
  process.stderr.write('entry.txt is empty\n');
  process.exit(1);
}
if (line.length > 140) {
  process.stderr.write(`entry is ${line.length} characters, over the 140 limit\n`);
  process.exit(1);
}
if (line.includes('\n') || line.includes('\r')) {
  process.stderr.write('entry must be a single line\n');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'entry.txt'), line, 'utf8');
