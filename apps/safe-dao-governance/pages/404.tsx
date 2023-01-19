import type { NextPage } from 'next'

import { AppRoutes } from '@/config/routes'
import { Redirect } from '@/components/Redirect'

const My404Page: NextPage = () => {
  return <Redirect url={AppRoutes.index} replace />
}

export default My404Page
