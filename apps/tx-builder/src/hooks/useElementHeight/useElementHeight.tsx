import { RefObject, useEffect, useState } from 'react';

const useElementHeight = (elementRef: RefObject<HTMLElement>) => {
  const [height, setHeight] = useState<number | undefined>();

  useEffect(() => {
    // hack to calculate properly the height of a container
    setTimeout(() => {
      const height = elementRef?.current?.clientHeight;
      setHeight(height);
    }, 10);
  }, [elementRef]);

  return height;
};

export default useElementHeight;
