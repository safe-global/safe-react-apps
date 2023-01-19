import { LS_NAMESPACE } from '@/config/constants'

type BrowserStorage = typeof localStorage | typeof sessionStorage

class Storage {
  private readonly prefix: string
  private storage?: BrowserStorage

  constructor(storage?: BrowserStorage, prefix = LS_NAMESPACE) {
    this.prefix = prefix
    this.storage = storage
  }

  public getPrefixedKey = (key: string): string => {
    return `${this.prefix}${key}`
  }

  public getItem = <T>(key: string): T | null => {
    const fullKey = this.getPrefixedKey(key)
    let saved: string | null = null

    try {
      saved = this.storage?.getItem(fullKey) ?? null
    } catch (err) {
      console.error(
        `Failed to read "${key}" from local/session storage - ${(err as Error).message}`,
      )
    }

    if (saved == null) {
      return null
    }

    try {
      return JSON.parse(saved) as T
    } catch (err) {
      console.error(
        `Failed to read "${key}" from local/session storage - ${(err as Error).message}`,
      )
    }

    return null
  }

  public setItem = <T>(key: string, item: T): void => {
    const fullKey = this.getPrefixedKey(key)

    try {
      if (item == null) {
        this.storage?.removeItem(fullKey)
      } else {
        this.storage?.setItem(fullKey, JSON.stringify(item))
      }
    } catch (err) {
      console.error(`Failed to write "${key}" to local/session storage - ${(err as Error).message}`)
    }
  }

  public removeItem = (key: string): void => {
    const fullKey = this.getPrefixedKey(key)

    try {
      this.storage?.removeItem(fullKey)
    } catch (err) {
      console.error(
        `Failed to remove "${key}" from local/session storage - ${(err as Error).message}`,
      )
    }
  }
}

export default Storage
