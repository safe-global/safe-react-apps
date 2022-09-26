import { STORAGE_PREFIX } from "src/config/constants"

type BrowserStorage = typeof localStorage | typeof sessionStorage

class Storage {
  private prefix: string
  private storage: BrowserStorage
  private safeAddress: string

  constructor(
    storage: BrowserStorage,
    safeAddress: string,
    prefix = STORAGE_PREFIX
  ) {
    this.prefix = prefix
    this.storage = storage
    this.safeAddress = safeAddress
  }

  private prefixKey = (key: string): string => {
    return `${this.prefix}${this.safeAddress}${key}`
  }

  public getItem = <T>(key: string): T | undefined => {
    const fullKey = this.prefixKey(key)
    let saved: string | null = null
    try {
      saved = this.storage.getItem(fullKey)
    } catch {
      // ignore
    }

    if (!saved || saved === "undefined") return

    try {
      return JSON.parse(saved) as T
    } catch {
      // ignore
    }
  }

  public setItem = <T>(key: string, item: T): void => {
    const fullKey = this.prefixKey(key)
    try {
      this.storage.setItem(fullKey, JSON.stringify(item))
    } catch {
      // ignore
    }
  }

  public removeItem = (key: string): void => {
    const fullKey = this.prefixKey(key)
    try {
      this.storage.removeItem(fullKey)
    } catch {
      // ignore
    }
  }
}

export default Storage
