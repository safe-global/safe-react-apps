import { PieChart  } from 'react-minimal-pie-chart';
import { GatewayDefinitions } from '@gnosis.pm/safe-react-gateway-sdk';

const colors = [
  '#22594e',
  '#2f7d6d',
  '#3da18d',
  '#69c2b0',
  '#a1d9ce',
];

const Chart = ({ balance, threshold }: { balance: GatewayDefinitions["SafeBalanceResponse"], threshold: number }) => {
  const data = balance.items
    .filter((item) => {
      return Number(item.fiatBalance) >= threshold;
    })
    .map((item, index) => ({
      title: item.tokenInfo.symbol,
      color: colors[index % colors.length],
      value: Number(item.fiatBalance),
    }));

  return (
    <PieChart
      data={data}
      label={({ dataEntry }: any) => `${Math.round((dataEntry.value / +balance.fiatTotal) * 100)}% ${dataEntry.title}`}
      labelStyle={(index: number) => ({
        fill: data[index].color,
        fontSize: '4px',
        fontFamily: 'sans-serif',
      })}
      radius={42}
      labelPosition={110}
    />
  );
};

export default Chart;
