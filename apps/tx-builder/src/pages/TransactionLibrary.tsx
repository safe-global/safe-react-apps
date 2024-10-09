import { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import { useHref, useLinkClickHandler, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { ReactComponent as EmptyLibrary } from '../assets/empty-library.svg'
import DeleteBatchFromLibrary from '../components/modals/DeleteBatchFromLibrary'
import TransactionsBatchList from '../components/TransactionsBatchList'
import useModal from '../hooks/useModal/useModal'
import {
  getEditBatchUrl,
  HOME_PATH,
  REVIEW_AND_CONFIRM_PATH,
  TRANSACTION_LIBRARY_PATH,
} from '../routes/routes'
import { useTransactionLibrary } from '../store'
import { Batch } from '../typings/models'
import { AccordionDetails, Box, Typography } from '@material-ui/core'
import EditableLabel from '../components/EditableLabel'
import Text from '../components/Text'
import Dot from '../components/Dot'
import { Tooltip } from '../components/Tooltip'
import Button from '../components/Button'
import FixedIcon from '../components/FixedIcon'
import { Icon } from '../components/Icon'
import { Accordion, AccordionSummary } from '../components/Accordion'
import Link from '../components/Link'
import Wrapper from '../components/Wrapper'

const TransactionLibrary = () => {
  const { batches, removeBatch, executeBatch, downloadBatch, renameBatch } = useTransactionLibrary()
  const navigate = useNavigate()
  const {
    open: showDeleteBatchModal,
    openModal: openDeleteBatchModal,
    closeModal: closeDeleteBatchModal,
  } = useModal()
  const [batchToRemove, setBatchToRemove] = useState<Batch>()

  const hrefToHome = useHref(HOME_PATH)
  const internalOnClick = useLinkClickHandler(HOME_PATH)
  const redirectToHome = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    internalOnClick(event)
  }

  return (
    <Wrapper>
      <StyledTitle>Your transaction library</StyledTitle>

      {batches.length > 0 ? (
        batches.map(batch => (
          <StyledAccordion key={batch.id} compact TransitionProps={{ unmountOnExit: true }}>
            <StyledAccordionSummary style={{ backgroundColor: 'white' }}>
              {/* transactions count  */}
              <TransactionCounterDot color="primary">
                <Text color="white">{batch.transactions.length}</Text>
              </TransactionCounterDot>

              {/* editable batch name */}
              <StyledBatchTitle>
                <Tooltip placement="top" title="Edit batch name" backgroundColor="primary" arrow>
                  <div>
                    <EditableLabel onEdit={newBatchName => renameBatch(batch.id, newBatchName)}>
                      {batch.name}
                    </EditableLabel>
                  </div>
                </Tooltip>
              </StyledBatchTitle>

              {/* batch actions  */}
              <BatchButtonsContainer>
                {/* execute batch */}
                <Tooltip placement="top" title="Execute batch" backgroundColor="primary" arrow>
                  <div>
                    <ExecuteBatchButton
                      type="button"
                      aria-label="Execute batch"
                      variant="contained"
                      color="primary"
                      onClick={async event => {
                        event.stopPropagation()
                        await executeBatch(batch)
                        navigate(REVIEW_AND_CONFIRM_PATH, {
                          state: { from: TRANSACTION_LIBRARY_PATH },
                        })
                      }}
                    >
                      <FixedIcon type={'arrowSentWhite'} />
                    </ExecuteBatchButton>
                  </div>
                </Tooltip>

                {/* edit batch */}
                <Tooltip placement="top" title="Edit batch" backgroundColor="primary" arrow>
                  <StyledIconButton
                    onClick={async event => {
                      event.stopPropagation()
                      await executeBatch(batch)
                      navigate(getEditBatchUrl(batch.id), {
                        state: { from: TRANSACTION_LIBRARY_PATH },
                      })
                    }}
                  >
                    <Icon size="sm" type="edit" color="primary" aria-label="edit batch" />
                  </StyledIconButton>
                </Tooltip>

                {/* download batch */}
                <Tooltip placement="top" title="Download batch" backgroundColor="primary" arrow>
                  <StyledIconButton
                    onClick={event => {
                      event.stopPropagation()
                      downloadBatch(batch.name, batch.transactions)
                    }}
                  >
                    <Icon size="sm" type="importImg" color="primary" aria-label="Download" />
                  </StyledIconButton>
                </Tooltip>

                {/* delete batch */}
                <Tooltip placement="top" title="Delete Batch" backgroundColor="primary" arrow>
                  <StyledIconButton
                    size="small"
                    onClick={event => {
                      event.stopPropagation()
                      setBatchToRemove(batch)
                      openDeleteBatchModal()
                    }}
                  >
                    <Icon size="sm" type="delete" color="error" aria-label="Delete Batch" />
                  </StyledIconButton>
                </Tooltip>
              </BatchButtonsContainer>
            </StyledAccordionSummary>
            <AccordionDetails>
              {/* transactions batch list  */}
              <TransactionsBatchList
                transactions={batch.transactions}
                showTransactionDetails
                showBatchHeader={false}
              />
            </AccordionDetails>
          </StyledAccordion>
        ))
      ) : (
        <Box display="flex" flexDirection={'column'} alignItems={'center'} paddingTop={'128px'}>
          {/* Empty library Screen */}
          <EmptyLibrary />
          <StyledEmptyLibraryText>You don't have any saved batches.</StyledEmptyLibraryText>
          <StyledEmptyLibraryTextLink>
            Safe a batch by{' '}
            <StyledEmptyLibraryLink href={hrefToHome} onClick={redirectToHome}>
              <StyledLinkIcon
                size="sm"
                type="bookmark"
                color="primary"
                aria-label="go to transaction list view"
              />
              in transaction list view.
            </StyledEmptyLibraryLink>
          </StyledEmptyLibraryTextLink>
        </Box>
      )}
      {showDeleteBatchModal && batchToRemove && (
        <DeleteBatchFromLibrary
          batch={batchToRemove}
          onClick={(batch: Batch) => {
            closeDeleteBatchModal()
            removeBatch(batch.id)
            setBatchToRemove(undefined)
          }}
          onClose={() => {
            closeDeleteBatchModal()
            setBatchToRemove(undefined)
          }}
        />
      )}
    </Wrapper>
  )
}

export default TransactionLibrary

const StyledTitle = styled(Typography)`
  && {
    margin-top: 0px;
    margin-bottom: 16px;
    font-size: 20px;
    font-weight: 700;
    line-height: normal;
  }
`

const StyledAccordion = styled(Accordion)`
  &.MuiAccordion-root {
    margin-bottom: 0;
    border-radius: 8px;
    margin-bottom: 12px;
  }
`

const StyledAccordionSummary = styled(AccordionSummary)`
  height: 64px;

  & > .MuiAccordionSummary-content {
    display: flex;
    align-items: center;

    max-width: calc(100% - 32px);

    .MuiIconButton-root {
      padding: 8px;
    }
  }
`

const TransactionCounterDot = styled(Dot)`
  height: 24px;
  width: 24px;
  min-width: 24px;
  flex-shrink: 0;
`

const StyledBatchTitle = styled.div`
  padding-left: 4px;
  min-width: 10px;
`

const BatchButtonsContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  padding-left: 8px;

  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const ExecuteBatchButton = styled(Button)`
  &&.MuiButton-root {
    min-width: 0;
    width: 32px;
    height: 32px !important;
    padding: 0;
  }
`

const StyledIconButton = styled(IconButton)`
  &.MuiIconButton-root {
    border-radius: 4px;
    margin-left: 8px;
    background-color: #f6f7f8;
  }
`

const StyledEmptyLibraryText = styled(Text)`
  && {
    max-width: 320px;
    margin-top: 32px;
    font-size: 20px;
    color: #566976;
  }
`

const StyledEmptyLibraryTextLink = styled(Text)`
  && {
    margin-top: 8px;
    color: #566976;
    text-decoration: none;
  }
`

const StyledLinkIcon = styled(Icon)`
  vertical-align: middle;
  margin-right: 2px;
`

const StyledEmptyLibraryLink = styled(Link)`
  && {
    text-decoration: none;
  }
`
