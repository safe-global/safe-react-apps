import { Link, SvgIcon } from '@mui/material'
import type { ReactElement } from 'react'

import Hat from '@/public/images/hat.svg'
import { AppRoutes } from '@/config/routes'

import css from './styles.module.css'

export const EducationLink = (): ReactElement => {
  return (
    <Link variant="body1" className={css.educationSeriesLink} p={2} href={AppRoutes.safedao}>
      <SvgIcon component={Hat} inheritViewBox fontSize="small" />
      What is SafeDAO?
    </Link>
  )
}
