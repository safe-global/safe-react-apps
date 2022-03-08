import { FixedIcon, Icon, Text, Title, Tooltip } from '@gnosis.pm/safe-react-components';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { EDIT_BATCH_PATH, HOME_PATH, TRANSACTION_LIBRARY_PATH } from '../routes/routes';
import { useTransactionLibrary } from '../store';
import ChecksumWarning from './ChecksumWarning';

const HELP_ARTICLE_LINK =
  'https://help.gnosis-safe.io/en/articles/4680071-create-a-batched-transaction-with-the-transaction-builder-safe-app';

const Header = () => {
  const { pathname } = useLocation();

  const { batches } = useTransactionLibrary();

  const isHomePath = pathname === HOME_PATH;
  const isEditTransactionLibraryPath = pathname === EDIT_BATCH_PATH;

  return (
    <>
      <HeaderWrapper>
        {isHomePath && (
          <>
            <StyledTitle size="xl">Transaction Builder</StyledTitle>
            <Tooltip placement="top" title="Help Article" backgroundColor="primary" textColor="white" arrow>
              <a href={HELP_ARTICLE_LINK} target="_blank" rel="noreferrer">
                <Icon size="md" type="info" />
              </a>
            </Tooltip>
          </>
        )}

        {!isHomePath && (
          <StyledLink to={isEditTransactionLibraryPath ? TRANSACTION_LIBRARY_PATH : HOME_PATH}>
            <FixedIcon type={'chevronLeft'} />
            <StyledLeftLinkLabel size="xl">
              {isEditTransactionLibraryPath ? 'Back to transaction library' : 'Back to transaction creation'}
            </StyledLeftLinkLabel>
          </StyledLink>
        )}

        {isHomePath && (
          <RigthLinkWrapper>
            <StyledLink to={TRANSACTION_LIBRARY_PATH}>
              <StyledRightLinkLabel size="xl">{`(${batches.length}) Your transaction library`}</StyledRightLinkLabel>
              <FixedIcon type={'chevronRight'} />
            </StyledLink>
          </RigthLinkWrapper>
        )}
      </HeaderWrapper>
      <ChecksumWarning />
    </>
  );
};

export default Header;

const HeaderWrapper = styled.header`
  position: fixed;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e2e3e3;
  z-index: 10;
  background-color: white;
  height: 70px;
  padding: 0 40px;
  box-sizing: border-box;
`;

const StyledTitle = styled(Title)`
  font-size: 20px;
  margin: 0 10px 0 0;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #000000;
  font-size: 16px;
  text-decoration: none;
`;

const StyledLeftLinkLabel = styled(Text)`
  margin-left: 8px;
`;

const RigthLinkWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
`;

const StyledRightLinkLabel = styled(Text)`
  margin-right: 8px;
`;
