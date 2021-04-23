import styled from 'styled-components';
import EthBalance from './components/EthBalance';
import WethBalance from './components/WethBalance';
import Wrapper from './components/Wrapper';
import { CardContent, makeStyles, CardHeader } from '@material-ui/core';
import { ButtonLink, Card, Text, Title } from '@gnosis.pm/safe-react-components';
import React, { useState } from 'react';

const useStyles = makeStyles({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: "32px",
    height: "32px",
  },
});

const StyledTitle = styled(Title)`
  margin-top: 0;`;


const App: React.FC = () => {
  const classes = useStyles();
  const [wrap, setWrap] = useState(true);

  return (
    <Card className={classes.root}>
      <CardHeader
        title={
          wrap ?
            <StyledTitle size="sm">Wrap ETH</StyledTitle> :
            <StyledTitle size="sm">Unwrap WETH</StyledTitle>
        }
        action={
          <ButtonLink iconType="code" iconSize="md" color="primary" textSize="xl" onClick={() => setWrap(!wrap)} >Switch</ButtonLink>
        }
      />
      <CardContent>
        {wrap ?
          <Text size="xl" strong>How much ETH do you want to wrap? </Text> :
          <Text size="xl" strong>How much WETH do you want to unwrap? </Text>
        }
        <br />
        {wrap ?
          <EthBalance />
          : <WethBalance />}
        <br />
        <Wrapper wrap={wrap} />
      </CardContent>
    </Card >
  );
};

export default App;
