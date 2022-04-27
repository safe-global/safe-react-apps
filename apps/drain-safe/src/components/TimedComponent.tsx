import useTimeout from '../hooks/useTimeout'

type Props = {
  onTimeout: () => void
  timeout: number
}

const TimedComponent: React.FC<Props> = ({ onTimeout, timeout, children }) => {
  useTimeout(onTimeout, timeout)

  return children as React.ReactElement
}

export default TimedComponent
