import { useRef } from 'react'
import { alpha } from '@material-ui/core'
import Hidden from '@material-ui/core/Hidden'
import styled from 'styled-components'
import { useTheme } from '@material-ui/core/styles'

import { ReactComponent as CreateNewBatchSVG } from '../assets/add-new-batch.svg'
import useDropZone from '../hooks/useDropZone'
import { useMediaQuery } from '@material-ui/core'
import { Icon } from './Icon'
import Text from './Text'
import ButtonLink from './buttons/ButtonLink'

type CreateNewBatchCardProps = {
  onFileSelected: (file: File | null) => void
}

const CreateNewBatchCard = ({ onFileSelected }: CreateNewBatchCardProps) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const fileRef = useRef<HTMLInputElement | null>(null)
  const { isOverDropZone, isAcceptError, dropHandlers } = useDropZone((file: File | null) => {
    onFileSelected(file)
  }, '.json')

  const handleFileSelected = (event: any) => {
    event.preventDefault()
    if (event.target.files.length) {
      onFileSelected(event.target.files[0])
      event.target.value = ''
    }
  }

  const handleBrowse = function (event: any) {
    event.preventDefault()
    fileRef.current?.click()
  }

  return (
    <Wrapper isSmallScreen={isSmallScreen}>
      <Hidden smDown>
        <CreateNewBatchSVG />
      </Hidden>
      <StyledDragAndDropFileContainer
        {...dropHandlers}
        dragOver={isOverDropZone}
        fullWidth={isSmallScreen}
        error={isAcceptError}
      >
        {isAcceptError ? (
          <StyledText variant="body1" error={isAcceptError}>
            The uploaded file is not a valid JSON file
          </StyledText>
        ) : (
          <>
            <Icon type="termsOfUse" size="sm" />
            <StyledText variant="body1">Drag and drop a JSON file or</StyledText>
            <StyledButtonLink color="secondary" onClick={handleBrowse}>
              choose a file
            </StyledButtonLink>
          </>
        )}
      </StyledDragAndDropFileContainer>
      <input
        ref={fileRef}
        id="logo-input"
        type="file"
        onChange={handleFileSelected}
        accept=".json"
        hidden
      />
    </Wrapper>
  )
}

export default CreateNewBatchCard

const Wrapper = styled.div<{ isSmallScreen: boolean }>`
  margin-top: ${({ isSmallScreen }) => (isSmallScreen ? '0' : '64px')};
`

const StyledDragAndDropFileContainer = styled.div<{
  dragOver: Boolean
  fullWidth: boolean
  error: Boolean
}>`
  box-sizing: border-box;
  max-width: ${({ fullWidth }) => (fullWidth ? '100%' : '420px')};
  border: 2px dashed
    ${({ theme, error }) => (error ? theme.palette.error.main : theme.palette.secondary.dark)};
  border-radius: 8px;
  background-color: ${({ theme, error }) =>
    error ? alpha(theme.palette.error.main, 0.7) : theme.palette.secondary.background};
  padding: 24px;
  margin: 24px auto 0 auto;

  display: flex;
  justify-content: center;
  align-items: center;

  ${({ dragOver, error, theme }) => {
    if (dragOver) {
      return `
        transition: all 0.2s ease-in-out;
        transform: scale(1.05);
      `
    }

    return `
      border-color: ${error ? theme.palette.error.main : theme.palette.secondary.dark};
      background-color: ${
        error ? alpha(theme.palette.error.main, 0.7) : theme.palette.secondary.background
      };
    `
  }}
`

const StyledText = styled(Text)<{ error?: Boolean }>`
  && {
    margin-left: 4px;
    color: ${({ error, theme }) =>
      error ? theme.palette.common.white : theme.palette.text.secondary};
  }
`

const StyledButtonLink = styled(ButtonLink)`
  margin-left: 0.3rem;
  padding: 0;
  text-decoration: none;

  && > p {
    color: ${({ theme }) => theme.palette.secondary.dark};
  }
`
