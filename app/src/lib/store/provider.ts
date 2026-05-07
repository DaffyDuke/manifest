import { MemoryStore } from './memory';
import type { Store } from './types';
import { SEEDS } from '~/content/seeds';

declare global {
  // eslint-disable-next-line no-var
  var __manifest_store: Store | undefined;
}

let booted = false;

function seedFixtures(store: Store): void {
  for (const s of SEEDS) {
    store.addSignature({ name: s.name, linkedin: s.linkedin });
  }
}

export function getStore(): Store {
  if (!globalThis.__manifest_store) {
    globalThis.__manifest_store = new MemoryStore();
  }
  if (!booted) {
    booted = true;
    seedFixtures(globalThis.__manifest_store);
  }
  return globalThis.__manifest_store;
}
