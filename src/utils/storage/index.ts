import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Tiny key/value storage helper backed by AsyncStorage on native.
 *
 * Only deals in strings — callers serialise structured data to JSON
 * before writing (see `businessService`). A web-safe shim lives next to
 * this file (`index.web.ts`) so the same import works under `expo web`.
 *
 * Every method swallows the underlying error and falls back to a sane
 * default so a flaky read never crashes a screen; persistence is a
 * best-effort convenience layer until the real backend lands.
 */
export const storage = {
  async getItem(key: string, defaultValue: string = ""): Promise<string> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ?? defaultValue;
    } catch {
      return defaultValue;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // best-effort: ignore write failures
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // best-effort: ignore delete failures
    }
  },
};
