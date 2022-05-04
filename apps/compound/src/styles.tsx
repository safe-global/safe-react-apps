import { TextField, Title } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

export const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;

  margin-bottom: 15px;

  *:first-child {
    margin-right: 5px;
  }
`

export const InfoContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 100%;
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 15px;

  button:not(:first-child) {
    margin-left: 10px;
  }
`

export const StyledTextField = styled(TextField)`
  &.MuiTextField-root {
    width: 100%;
  }
`

export const StyledTitle = styled(Title)`
  margin-top: 0;
`

export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(100vw - 50px);
  height: calc(100vh);
`
