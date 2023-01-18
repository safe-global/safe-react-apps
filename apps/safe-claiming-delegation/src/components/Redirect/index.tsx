import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect } from 'react'
import type { UrlObject } from 'url'

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export const Redirect = ({
  url,
  replace,
}: {
  url: string | UrlObject
  replace?: boolean
}): null => {
  const router = useRouter()

  useIsomorphicLayoutEffect(() => {
    if (replace) {
      router.replace(url)
    } else {
      router.push(url)
    }
  }, [replace, router, url])

  return null
}
