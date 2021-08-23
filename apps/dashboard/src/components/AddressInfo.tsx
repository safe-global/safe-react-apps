import { EthHashInfo } from '@gnosis.pm/safe-react-components';

const getExplorerUrl = (hash: string) => {
  return () => ({
    url: `https://etherscan.io/address/${hash}`,
    alt: ''
  });
};

function AddressInfo({ hash }: { hash: string }): JSX.Element {
  return (
    <EthHashInfo hash={hash} showAvatar avatarSize="sm" explorerUrl={getExplorerUrl(hash)} />
  );
}

export default AddressInfo
