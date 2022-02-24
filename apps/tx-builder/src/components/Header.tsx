import { FixedIcon, Icon, Text, Title, Tooltip } from '@gnosis.pm/safe-react-components';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { HOME_PATH, REVIEW_AND_CONFIRM_PATH } from '../routes/routes';

const Header = () => {
  const { pathname } = useLocation();

  const isReviewAndConfirmPath = pathname === REVIEW_AND_CONFIRM_PATH;

  return (
    <HeaderWrapper>
      {isReviewAndConfirmPath ? (
        <StyledLink to={HOME_PATH}>
          <FixedIcon type={'chevronLeft'} />
          <StyledLinkLabel size="xl">Back to Transaction Creation</StyledLinkLabel>
        </StyledLink>
      ) : (
        <>
          <StyledTitle size="xl">Transaction Builder</StyledTitle>
          <Tooltip placement="top" title="Help Article" backgroundColor="primary" textColor="white" arrow>
            <a
              href="https://help.gnosis-safe.io/en/articles/4680071-create-a-batched-transaction-with-the-transaction-builder-safe-app"
              target="_blank"
              rel="noreferrer"
            >
              <Icon size="md" type="info" />
            </a>
          </Tooltip>
        </>
      )}
    </HeaderWrapper>
  );
};

export default Header;

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;

  border-bottom: 1px solid #e2e3e3;
  background-color: white;
  height: 70px;
  padding: 0 40px;
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

const StyledLinkLabel = styled(Text)`
  margin-left: 12px;
`;
