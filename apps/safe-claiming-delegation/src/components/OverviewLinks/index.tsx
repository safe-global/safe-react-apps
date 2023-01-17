import { SvgIcon, Grid, Typography, Paper, Box } from '@mui/material'
import NextLink from 'next/link'
import type { ReactElement } from 'react'

import Hat from '@/public/images/hat.svg'
import { AppRoutes } from '@/config/routes'
import { FORUM_URL, SNAPSHOT_URL } from '@/config/constants'
import LinkIcon from '@/public/images/link.svg'
import { externalLinkIconStyle } from '@/components/ExternalLink'

import css from './styles.module.css'

// We can't nest anchor tags so this mirrors the MuiLink instead
const LinkTitle = ({ children, external }: { children: string; external?: boolean }) => {
  return (
    <Typography className={css.link}>
      {children}
      {external && <LinkIcon style={externalLinkIconStyle} />}
    </Typography>
  )
}

const ExternalLinkCard = ({
  header,
  title,
  href,
}: {
  header: string
  title: string
  href: string
}): ReactElement => {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      <Paper className={css.card}>
        <Typography className={css.title}>{header}</Typography>
        <LinkTitle external>{title}</LinkTitle>
      </Paper>
    </a>
  )
}

export const OverviewLinks = (): ReactElement => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <NextLink href={AppRoutes.safedao} passHref>
          <a href={AppRoutes.safedao}>
            <Paper className={css.card}>
              <div className={css.header}>
                <Typography className={css.title}>About</Typography>
                <SvgIcon component={Hat} inheritViewBox color="info" />
              </div>
              <Box sx={{ alignSelf: 'flex-end' }}>
                <Typography variant="h3" fontWeight={700}>
                  What is SafeDAO?
                </Typography>
                <LinkTitle>Learn more</LinkTitle>
              </Box>
            </Paper>
          </a>
        </NextLink>
      </Grid>
      <Grid item container xs={6} spacing={1} flexDirection="column">
        <Grid item xs>
          <ExternalLinkCard href={FORUM_URL} header="Discuss" title="SafeDAO forum" />
        </Grid>
        <Grid item xs>
          <ExternalLinkCard href={SNAPSHOT_URL} header="Vote" title="Snaptshot" />
        </Grid>
      </Grid>
    </Grid>
  )
}
