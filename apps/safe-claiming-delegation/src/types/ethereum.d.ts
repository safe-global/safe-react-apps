declare global {
  interface Window {
    ethereum?: {
      _metamask: {
        isUnlocked: () => Promise<boolean>
      }
    }
  }
}

export {}
