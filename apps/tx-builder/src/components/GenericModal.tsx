import React from 'react'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import { alpha } from '@material-ui/core/styles'
import styled from 'styled-components'
import Media from 'react-media'
import { Typography } from '@material-ui/core'
import { Icon } from './Icon'

const StyledButton = styled.button`
  background: none;
  border: none;
  padding: 5px;
  width: 26px;
  height: 26px;

  span {
    margin-right: 0;
  }

  :focus {
    outline: none;
  }

  :hover {
    background: ${({ theme }) => theme.palette.divider};
    border-radius: 16px;
  }
`

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 2px solid ${({ theme }) => theme.palette.divider};
`

const BodySection = styled.div<{
  withoutBodyPadding?: boolean
  smallHeight: boolean
}>`
  max-height: ${({ smallHeight }) => (smallHeight ? '280px' : '460px')};
  overflow-y: auto;
  padding: ${({ withoutBodyPadding }) => (withoutBodyPadding ? '0' : '16px 24px')};
`

const FooterSection = styled.div`
  border-top: 2px solid ${({ theme }) => theme.palette.divider};
  padding: 16px 24px;
`

const ModalPaper = styled.div`
  background: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.primary};
`

export type GenericModalProps = {
  title: string | React.ReactNode
  body: React.ReactNode
  withoutBodyPadding?: boolean
  footer?: React.ReactNode
  onClose: () => void
}

const useStyles = makeStyles({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'scroll',
    background: alpha('#E8E7E6', 0.75),
  },

  paper: {
    position: (props: { smallHeight: boolean }) => (props.smallHeight ? 'relative' : 'absolute'),
    top: (props: { smallHeight: boolean }) => (props.smallHeight ? 'unset' : '121px'),
    minWidth: '500px',
    width: (props: { smallHeight: boolean }) => (props.smallHeight ? '500px' : 'inherit'),
    borderRadius: '8px',
    boxShadow: `0 0 0.75 0 #28363D`,

    '&:focus': {
      outline: 'none',
    },
  },
})

const GenericModalComponent = ({
  body,
  footer,
  onClose,
  title,
  withoutBodyPadding,
  smallHeight,
}: GenericModalProps & { smallHeight: boolean }) => {
  const classes = useStyles({ smallHeight })

  return (
    <Modal open className={classes.modal}>
      <ModalPaper className={classes.paper}>
        <TitleSection>
          <Typography variant="h6">{title}</Typography>
          <StyledButton onClick={onClose}>
            <Icon size="sm" type="cross" />
          </StyledButton>
        </TitleSection>

        <BodySection withoutBodyPadding={withoutBodyPadding} smallHeight={smallHeight}>
          {body}
        </BodySection>

        {footer && <FooterSection>{footer}</FooterSection>}
      </ModalPaper>
    </Modal>
  )
}

const GenericModal = (props: GenericModalProps): React.ReactElement => (
  <Media query={{ maxHeight: 500 }}>
    {matches => <GenericModalComponent {...props} smallHeight={matches} />}
  </Media>
)

export default GenericModal
