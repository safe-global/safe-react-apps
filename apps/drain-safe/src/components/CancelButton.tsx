import { Button, Loader } from '@gnosis.pm/safe-react-components'
import Flex from './Flex'

function CancelButton({ children }: { children: string }): JSX.Element {
  return (
    <>
      <Flex centered>
        <Loader size="md" />
      </Flex>
      <Flex centered>
        <Button size="lg" color="secondary" type="reset">
          {children}
        </Button>
      </Flex>
    </>
  )
}

export default CancelButton
