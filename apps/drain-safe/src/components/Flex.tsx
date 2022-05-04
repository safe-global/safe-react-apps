import styled, { css } from 'styled-components'

const Flex = styled.div<{ centered?: boolean }>`
  display: flex;
  align-items: center;

  ${props =>
    props.centered &&
    css`
      justify-content: center;
    `}
`

export default Flex
