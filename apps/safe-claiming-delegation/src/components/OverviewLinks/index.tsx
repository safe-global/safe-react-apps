import NextLink from 'next/link'
import { SvgIcon, Grid, Typography, Paper, Box, Link } from '@mui/material'
import { ReactElement, useRef } from 'react'

import Hat from '@/public/images/hat.svg'
import { AppRoutes } from '@/config/routes'
import { FORUM_URL, SNAPSHOT_URL } from '@/config/constants'
import { ExternalLink } from '@/components/ExternalLink'

import css from './styles.module.css'

const SafeDaoCard = () => {
  const linkRef = useRef<HTMLAnchorElement>(null)

  const onClick = () => {
    linkRef.current?.click()
  }

  return (
    <Paper className={css.card} onClick={onClick}>
      <div className={css.header}>
        <Typography className={css.title}>About</Typography>
        <SvgIcon component={Hat} inheritViewBox color="info" />
      </div>
      <Box sx={{ alignSelf: 'flex-end' }}>
        <Typography variant="h3" fontWeight={700}>
          What is SafeDAO?
        </Typography>
        <NextLink href={AppRoutes.safedao} passHref>
          <Link ref={linkRef}>Learn more</Link>
        </NextLink>
      </Box>
    </Paper>
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
  const linkRef = useRef<HTMLAnchorElement>(null)

  const onClick = () => {
    linkRef.current?.click()
  }

  return (
    <Paper className={css.card} onClick={onClick}>
      <Typography className={css.title}>{header}</Typography>
      <ExternalLink href={href} ref={linkRef}>
        {title}
      </ExternalLink>
    </Paper>
  )
}

export const OverviewLinks = (): ReactElement => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <SafeDaoCard />
      </Grid>
      <Grid item container xs={6} spacing={1} flexDirection="column">
        <Grid item xs>
          <ExternalLinkCard href={FORUM_URL} header="Discuss" title="SafeDAO forum" />
        </Grid>
        <Grid item xs>
          <ExternalLinkCard href={SNAPSHOT_URL} header="Vote" title="Snapshot" />
        </Grid>
      </Grid>
    </Grid>
  )
}
