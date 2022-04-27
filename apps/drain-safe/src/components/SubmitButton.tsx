import { Button } from '@gnosis.pm/safe-react-components'
import Flex from './Flex'

function SubmitButton({
  children,
  disabled,
}: {
  children: string
  disabled?: boolean
}): JSX.Element {
  return (
    <Flex centered>
      <Button size="lg" color="primary" variant="contained" type="submit" disabled={disabled}>
        {children}
      </Button>
    </Flex>
  )
}

export default SubmitButton
