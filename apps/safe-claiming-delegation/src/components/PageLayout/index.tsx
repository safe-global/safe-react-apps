import Head from 'next/head'
import { Box, Paper } from '@mui/material'
import type { ReactElement, ReactNode } from 'react'

import manifestJson from '@/public/manifest.json'
import { BottomCircle, TopCircle } from '@/components/BackgroundCircles'
import { Header } from '@/components/Header'

import css from './styles.module.css'

export const PageLayout = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <>
      <Head>
        <title>{manifestJson.name}</title>
      </Head>

      <Header />

      <Box pt={6} component="main">
        <Paper className={css.container}>
          <BottomCircle />

          {children}

          <TopCircle />
        </Paper>
      </Box>
    </>
  )
}
