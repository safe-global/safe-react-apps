import { useLayoutEffect } from 'react'
import { useRouter } from 'next/router'
import { AppRoutes } from '@/config/routes'

const _404 = (): null => {
  const router = useRouter()

  useLayoutEffect(() => {
    router.replace(AppRoutes.index)
  }, [router])

  return null
}

export default _404
