import styled from 'styled-components';
import { Text, IconText, Icon } from '@gnosis.pm/safe-react-components';

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 10px;

  > :first-of-type {
    margin-right: 5px;
  }
`;

const Image = styled.div<{ src: string }>`
  background: url('${({ src }) => src}') no-repeat center;
  height: 60px;
  width: 60px;
  background-size: contain;
`;

type Props = {
  name: string;
  url: string;
  iconSrc: string;
};

const WCClientInfo = ({ name, url, iconSrc }: Props) => {
  return (
    <Wrapper>
      <Image src={iconSrc} />
      <div>
        <Wrapper>
          <Text size="xl" as="span" strong>
            {name}
          </Text>
          <IconText iconSize="sm" iconType="check" text="Connected" textSize="lg" color="primary" />
        </Wrapper>
        <Wrapper>
          <a target="_blank" href={url} rel="noopener noreferrer">
            <Text color="primary" size="lg">
              {url}
            </Text>
          </a>
          <Icon type="externalLink" color="primary" size="sm" />
        </Wrapper>
      </div>
    </Wrapper>
  );
};

export default WCClientInfo;
