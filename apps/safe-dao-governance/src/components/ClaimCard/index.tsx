import { ShieldOutlined } from '@mui/icons-material'
import { Grid, Paper, Typography, Tooltip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { formatEther } from 'ethers/lib/utils'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import type { ReactElement } from 'react'

import SingleGreenTile from '@/public/images/single-green-tile.svg'
import DoubleGreenTile from '@/public/images/double-green-tile.svg'
import { formatAmount } from '@/utils/formatters'
import { Odometer } from '@/components/Odometer'

import css from './styles.module.css'

export const ClaimCard = ({
  isGuardian,
  ecosystemAmount,
  totalAmount,
  variant,
}: {
  isGuardian: boolean
  ecosystemAmount: string
  totalAmount: string
  variant: 'claimable' | 'vesting'
}): ReactElement => {
  const { palette } = useTheme()

  const ecosystemAmountInEth = formatEther(ecosystemAmount)
  const totalAmountInEth = formatEther(totalAmount)

  const isClaimable = variant === 'claimable'

  const color = isClaimable ? palette.background.default : palette.text.primary

  return (
    <Paper
      sx={{
        p: 3,
        backgroundColor: ({ palette }) =>
          isClaimable ? palette.primary.main : palette.background.default,
        color,
        position: 'relative',
      }}
    >
      {isClaimable && (
        <>
          <SingleGreenTile className={css.singleTile} color="secondary" />
          <DoubleGreenTile className={css.doubleTile} color="secondary" />
        </>
      )}

      <Typography marginBottom={2} fontWeight={700}>
        {isClaimable ? 'Claim now' : 'Claim in future (vesting)'}

        {!isClaimable && (
          <Tooltip
            title={
              <Typography>
                Linear vesting over 4 years from a starting date of 27.09.2022
              </Typography>
            }
            arrow
            placement="top"
          >
            <InfoOutlined
              sx={{
                height: '16px',
                width: '16px',
                mb: '-2px',
                ml: 1,
              }}
            />
          </Tooltip>
        )}
      </Typography>

      <Grid container direction="column">
        <Grid item display="flex" gap={1} alignItems="center">
          <Typography variant="subtitle2" color={color}>
            Total
          </Typography>
          <Tooltip
            title={
              <Typography>
                {isGuardian ? (
                  <>
                    This includes a Safe Guardian allocation of{' '}
                    <strong>{formatAmount(ecosystemAmountInEth, 2)} SAFE</strong>
                  </>
                ) : (
                  'Not eligible for Safe Guardian allocation. Contribute to the community to become a Safe Guardian.'
                )}
              </Typography>
            }
            arrow
            placement="top"
          >
            <ShieldOutlined
              sx={{
                height: '16px',
                width: '16px',
              }}
            />
          </Tooltip>
        </Grid>
        <Grid item display="flex" alignItems="center">
          <Typography
            variant="h3"
            variantMapping={{
              h3: 'span',
            }}
            className={css.amountDisplay}
          >
            <Odometer value={Number(totalAmountInEth)} decimals={2} /> SAFE
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}
