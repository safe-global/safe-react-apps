import { useRouter } from 'next/router'
import { useLayoutEffect } from 'react'
import type { UrlObject } from 'url'

export const Redirect = ({
  url,
  replace,
}: {
  url: string | UrlObject
  replace?: boolean
}): null => {
  const router = useRouter()

  useLayoutEffect(() => {
    if (replace) {
      router.replace(url)
    } else {
      router.push(url)
    }
  }, [router, url])

  return null
}
