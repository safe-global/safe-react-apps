import { BreakpointDefaults } from '@material-ui/core/styles/createBreakpoints'
import React from 'react'
import styled from 'styled-components'

type Props = {
  children: string | React.ReactNode
  size: keyof BreakpointDefaults
  withoutMargin?: boolean
  strong?: boolean
}

const StyledH1 = styled.h1<{ withoutMargin?: boolean; strong?: boolean }>`
  font-family: ${({ theme }) => theme.legacy.fonts.fontFamily};
  font-size: ${({ theme }) => theme.legacy.title.size.xl.fontSize};
  line-height: ${({ theme }) => theme.legacy.title.size.xl.lineHeight};
  font-weight: ${({ strong }) => (strong ? 'bold' : 'normal')};
  margin: ${({ withoutMargin }) => (withoutMargin ? 0 : '30px')} 0;
`

const StyledH2 = styled.h2<{ withoutMargin?: boolean; strong?: boolean }>`
  font-family: ${({ theme }) => theme.legacy.fonts.fontFamily};
  font-size: ${({ theme }) => theme.legacy.title.size.lg.fontSize};
  line-height: ${({ theme }) => theme.legacy.title.size.lg.lineHeight};
  font-weight: ${({ strong }) => (strong ? 'bold' : 'normal')};
  margin: ${({ withoutMargin }) => (withoutMargin ? 0 : '28px')} 0;
`

const StyledH3 = styled.h3<{ withoutMargin?: boolean; strong?: boolean }>`
  font-family: ${({ theme }) => theme.legacy.fonts.fontFamily};
  font-size: ${({ theme }) => theme.legacy.title.size.md.fontSize};
  line-height: ${({ theme }) => theme.legacy.title.size.md.lineHeight};
  font-weight: ${({ strong }) => (strong ? 'bold' : 'normal')};
  margin: ${({ withoutMargin }) => (withoutMargin ? 0 : '26px')} 0;
`

const StyledH4 = styled.h4<{ withoutMargin?: boolean; strong?: boolean }>`
  font-family: ${({ theme }) => theme.legacy.fonts.fontFamily};
  font-size: ${({ theme }) => theme.legacy.title.size.sm.fontSize};
  line-height: ${({ theme }) => theme.legacy.title.size.sm.lineHeight};
  font-weight: ${({ strong }) => (strong ? 'bold' : 'normal')};
  margin: ${({ withoutMargin }) => (withoutMargin ? 0 : '22px')} 0;
`

const StyledH5 = styled.h5<{ withoutMargin?: boolean; strong?: boolean }>`
  font-family: ${({ theme }) => theme.legacy.fonts.fontFamily};
  font-size: ${({ theme }) => theme.legacy.title.size.xs.fontSize};
  line-height: ${({ theme }) => theme.legacy.title.size.xs.lineHeight};
  font-weight: ${({ strong }) => (strong ? 'bold' : 'normal')};
  margin: ${({ withoutMargin }) => (withoutMargin ? 0 : '18px')} 0;
`

const Title = ({ children, size, ...rest }: Props) => {
  switch (size) {
    case 'xl': {
      return <StyledH1 {...rest}>{children}</StyledH1>
    }
    case 'lg': {
      return <StyledH2 {...rest}>{children}</StyledH2>
    }
    case 'md': {
      return <StyledH3 {...rest}>{children}</StyledH3>
    }
    case 'sm': {
      return <StyledH4 {...rest}>{children}</StyledH4>
    }
    case 'xs': {
      return <StyledH5 {...rest}>{children}</StyledH5>
    }
  }
}

export default Title
