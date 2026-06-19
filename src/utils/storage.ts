/**
 * storage — small cross-platform key/value wrapper used by the auth store.
 *
 * The login flow persists the signed-in session under a single key
 * (`yalini.auth.session.v1`) so the user stays logged in across app restarts.
 * `authStore` only needs three primitives, so that's all this exposes:
 *
 *   secureGet<T>   — read a stored value (returns defaultValue if missing)
 *   secureSet      — write a value
 *   secureRemove   — delete a value
 *
 * Platform behaviour:
 *   - native (iOS / Android) → expo-secure-store (encrypted keychain).
 *   - web (preview / browser) → window.localStorage, because
 *     expo-secure-store has no web implementation and throws when called.
 *
 * Every method is defensive: a failure never throws up into the auth
 * bootstrap (which would wedge the app on the loading screen) — it logs and
 * falls back to the default instead.
 *
 * Usage:
 *   import { storage } from "../utils/storage"
 *   await storage.secureSet("yalini.auth.session.v1", JSON.stringify(session))
 *   const raw = await storage.secureGet<string>("yalini.auth.session.v1", "")
 *   await storage.secureRemove("yalini.auth.session.v1")
 */

import { Platform } from "react-native"
import * as SecureStore from "expo-secure-store"

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface Storage {
  secureGet<T>(key: string, defaultValue: T): Promise<T>
  secureSet(key: string, value: string): Promise<void>
  secureRemove(key: string): Promise<void>
}

const isWeb = Platform.OS === "web"

// ─────────────────────────────────────────────────────────────
// WEB BACKEND (localStorage)
// ─────────────────────────────────────────────────────────────

function webGet(key: string): string | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null
    return window.localStorage.getItem(key)
  } catch (error) {
    console.warn(`[storage] web get failed for "${key}":`, error)
    return null
  }
}

function webSet(key: string, value: string): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return
    window.localStorage.setItem(key, value)
  } catch (error) {
    console.warn(`[storage] web set failed for "${key}":`, error)
  }
}

function webRemove(key: string): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn(`[storage] web remove failed for "${key}":`, error)
  }
}

// ─────────────────────────────────────────────────────────────
// IMPLEMENTATION
// ─────────────────────────────────────────────────────────────

export const storage: Storage = {
  async secureGet<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const value = isWeb ? webGet(key) : await SecureStore.getItemAsync(key)
      if (value === null || value === undefined) {
        return defaultValue
      }
      return value as unknown as T
    } catch (error) {
      console.warn(`[storage] secureGet failed for key "${key}":`, error)
      return defaultValue
    }
  },

  async secureSet(key: string, value: string): Promise<void> {
    try {
      if (isWeb) {
        webSet(key, value)
      } else {
        await SecureStore.setItemAsync(key, value)
      }
    } catch (error) {
      console.warn(`[storage] secureSet failed for key "${key}":`, error)
    }
  },

  async secureRemove(key: string): Promise<void> {
    try {
      if (isWeb) {
        webRemove(key)
      } else {
        await SecureStore.deleteItemAsync(key)
      }
    } catch (error) {
      console.warn(`[storage] secureRemove failed for key "${key}":`, error)
    }
  },
}
