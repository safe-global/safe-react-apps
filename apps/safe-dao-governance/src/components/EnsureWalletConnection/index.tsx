import { useRouter } from 'next/router'
import type { ReactElement } from 'react'

import { AppRoutes } from '@/config/routes'
import { Redirect } from '../Redirect'
import { useWeb3 } from '@/hooks/useWeb3'

const isProviderRoute = (pathname: string) => {
  return [AppRoutes.claim, AppRoutes.delegate].includes(pathname)
}

export const EnsureWalletConnection = ({ children }: { children: ReactElement }): ReactElement => {
  const router = useRouter()
  const web3 = useWeb3()

  const shouldRedirect = !web3 && isProviderRoute(router.pathname)

  return shouldRedirect ? <Redirect url={AppRoutes.index} /> : children
}
