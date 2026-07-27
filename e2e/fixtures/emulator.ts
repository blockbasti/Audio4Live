/**
 * Helpers that talk to the Firebase emulators over their REST APIs.
 */
import { environment } from '../../src/environments/environment';

export const PROJECT_ID = environment.firebase.projectId;
export const API_KEY = environment.firebase.apiKey;

const FIRESTORE_HOST = 'http://127.0.0.1:8080';
const AUTH_HOST = 'http://127.0.0.1:9099';
const DOCS = `${FIRESTORE_HOST}/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

export const ADMIN_EMAIL = 'e2e-admin@audio4live.test';
export const ADMIN_PASSWORD = 'e2e-password';

async function ok(response: Response, what: string): Promise<Response> {
  if (!response.ok) {
    throw new Error(`${what} failed: ${response.status} ${await response.text()}`);
  }
  return response;
}

export async function resetEmulators(): Promise<void> {
  await ok(
    await fetch(`${FIRESTORE_HOST}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`, { method: 'DELETE' }),
    'firestore reset'
  );
  await ok(await fetch(`${AUTH_HOST}/emulator/v1/projects/${PROJECT_ID}/accounts`, { method: 'DELETE' }), 'auth reset');
}

export async function createAdminUser(email = ADMIN_EMAIL, password = ADMIN_PASSWORD): Promise<void> {
  await ok(
    await fetch(`${AUTH_HOST}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    }),
    'create admin user'
  );
}

/**
 * The calendar renders day cells at local start-of-day and matches them with
 * `isWithinInterval`, so blockers have to be aligned to local midnight to light up a cell.
 */
export function localMidnight(daysFromToday: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);
  return date;
}

export async function seedBlocker(start: Date, end: Date, isSingleDay = false): Promise<void> {
  await ok(
    await fetch(`${DOCS}/blocker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          start: { timestampValue: start.toISOString() },
          end: { timestampValue: end.toISOString() },
          isSingleDay: { booleanValue: isSingleDay }
        }
      })
    }),
    'seed blocker'
  );
}

export async function listDocuments(collection: string): Promise<Record<string, unknown>[]> {
  const response = await fetch(`${DOCS}/${collection}?pageSize=100`);
  if (response.status === 404) {
    return [];
  }
  const body = (await (await ok(response, `list ${collection}`)).json()) as { documents?: Record<string, unknown>[] };
  return body.documents ?? [];
}

/** Polls a collection until `predicate` matches a document, so tests don't depend on fixed sleeps. */
export async function waitForDocument(
  collection: string,
  predicate: (document: Record<string, unknown>) => boolean,
  timeoutMs = 20_000
): Promise<Record<string, unknown>> {
  const deadline = Date.now() + timeoutMs;
  let last: Record<string, unknown>[] = [];
  while (Date.now() < deadline) {
    last = await listDocuments(collection);
    const match = last.find(predicate);
    if (match) {
      return match;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`No document in "${collection}" matched within ${timeoutMs}ms (found ${last.length} documents)`);
}

/** Reads a Firestore REST document field as a plain string, whatever its value type. */
export function fieldAsString(document: Record<string, unknown>, path: string): string {
  let current: unknown = (document as { fields?: unknown }).fields;
  for (const segment of path.split('.')) {
    const value = (current as Record<string, Record<string, unknown>> | undefined)?.[segment];
    current = value && 'mapValue' in value ? (value['mapValue'] as { fields: unknown }).fields : Object.values(value ?? {})[0];
  }
  return typeof current === 'string' ? current : JSON.stringify(current ?? null);
}
