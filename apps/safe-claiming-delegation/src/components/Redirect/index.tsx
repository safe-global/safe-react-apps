import { useRouter } from 'next/router'
import { useLayoutEffect } from 'react'
import type { UrlObject } from 'url'

export const Redirect = ({ url }: { url: string | UrlObject }): null => {
  const router = useRouter()

  useLayoutEffect(() => {
    router.push(url)
  }, [router, url])

  return null
}
