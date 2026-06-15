/**
 * Web shim for the `storage` helper.
 *
 * Metro picks this file over `index.ts` when bundling for `expo web`, so
 * the same `import { storage } from "../utils/storage"` resolves to a
 * `localStorage`-backed implementation in the browser without pulling in
 * the native AsyncStorage module.
 *
 * Mirrors the native API exactly (string-only, best-effort, never throws).
 */
export const storage = {
  async getItem(key: string, defaultValue: string = ""): Promise<string> {
    try {
      const value = globalThis.localStorage?.getItem(key);
      return value ?? defaultValue;
    } catch {
      return defaultValue;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      // best-effort: ignore write failures
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      // best-effort: ignore delete failures
    }
  },
};
