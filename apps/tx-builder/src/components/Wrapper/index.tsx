import React from 'react'
import styled from 'styled-components'

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <StyledWrapper>
      <section>{children}</section>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.main`
  width: 100%;
  min-height: 100%;
  background: ${({ theme }) => theme.palette.background.main};
  color: ${({ theme }) => theme.palette.text.primary};

  > section {
    padding: 120px 48px 48px;
    box-sizing: border-box;
    max-width: 1024px;
    margin: 0 auto;
  }
`

export default Wrapper
