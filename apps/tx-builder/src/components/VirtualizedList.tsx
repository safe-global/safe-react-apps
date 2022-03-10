import { Virtuoso } from 'react-virtuoso';

type VirtualizedListProps<T> = {
  items: T[];
  renderVirtualWhenLengthGreaterThan: number;
  renderItem: (item: T, index: number) => React.ReactNode;
};

const VirtualizedList = <T extends unknown>({
  items,
  renderItem,
  renderVirtualWhenLengthGreaterThan,
}: VirtualizedListProps<T>) => {
  if (items.length > renderVirtualWhenLengthGreaterThan) {
    return <Virtuoso style={{ height: 600 }} data={items} itemContent={(index, item) => renderItem(item, index)} />;
  }

  return <>{items.map((item: any, index: number) => renderItem(item, index))}</>;
};

export default VirtualizedList;
