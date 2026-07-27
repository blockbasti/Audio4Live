import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * The Cloud Functions read `RECAPTCHA_KEY` via `defineString()`. The Firebase CLI only
 * resolves params from dotenv files inside `functions/` — a shell environment variable is
 * ignored and the emulator then prompts interactively (and registers zero triggers).
 *
 * `.env.local` is emulator-only and gitignored, so it can never leak into a real deploy.
 */
const target = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'functions', '.env.local');

writeFileSync(target, 'RECAPTCHA_KEY=e2e-dummy-recaptcha-secret\n');
console.log(`[e2e] wrote ${target}`);
