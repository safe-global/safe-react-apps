import { SyntheticEvent, useCallback } from 'react'
import { Title, ButtonLink } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import { InfoContainer } from '../styles'
import InfoRow from './InfoRow'

type Props = {
  balance: number | undefined
  onCollect: () => void
}

export default function CompBalance({
  balance,
  onCollect,
}: Props): React.ReactElement {
  const handleOnCollect = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault()
      if (balance && balance > 0) {
        onCollect()
      }
    },
    [balance, onCollect],
  )

  return (
    <InfoContainer>
      <Title size="sm">Compound Token Balance</Title>
      <InfoRow
        label="Your COMP"
        data={
          <>
            {Number.isNaN(balance) ? 0 : balance?.toFixed(8)}{' '}
            <Button color="primary" onClick={handleOnCollect}>
              Collect
            </Button>
          </>
        }
      />
    </InfoContainer>
  )
}

const Button = styled(ButtonLink)`
  display: inline-block;
`
