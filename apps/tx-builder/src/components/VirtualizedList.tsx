import { memo, useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import styled from 'styled-components';

type VirtualizedListProps<T> = {
  innerRef: any;
  items: T[];
  renderVirtualWhenLengthGreaterThan: number;
  renderItem: (item: T, index: number) => React.ReactNode;
};

const VirtualizedList = <T extends unknown>({
  items,
  renderItem,
  innerRef,
  renderVirtualWhenLengthGreaterThan,
}: VirtualizedListProps<T>) => {
  if (items.length > renderVirtualWhenLengthGreaterThan) {
    return (
      <Virtuoso
        style={{ height: 600 }}
        scrollerRef={innerRef}
        data={items}
        itemContent={(index, item) => renderItem(item, index)}
        components={{
          Item: HeightPreservingItem,
        }}
        totalCount={items.length}
        overscan={100}
      />
    );
  }

  return <>{items.map((item: any, index: number) => renderItem(item, index))}</>;
};

const HeightPreservingItem: React.FC = memo(({ children, ...props }: any) => {
  const [size, setSize] = useState(0);
  const knownSize = props['data-known-size'];

  useEffect(() => {
    setSize((prevSize) => {
      return knownSize === 0 ? prevSize : knownSize;
    });
  }, [knownSize]);

  return (
    <HeightPreservingContainer {...props} size={size}>
      {children}
    </HeightPreservingContainer>
  );
});

const HeightPreservingContainer = styled.div<{ size: number }>`
  --child-height: ${(props) => `${props.size}px`};
  &:empty {
    min-height: calc(var(--child-height));
    box-sizing: border-box;
  }
`;

export default VirtualizedList;
