import { useState, useRef, DragEventHandler, useMemo } from 'react';

export interface DropHandlers {
  onDragOver: DragEventHandler;
  onDragEnter: DragEventHandler;
  onDragLeave: DragEventHandler;
  onDrop: DragEventHandler;
}

const useDropZone = (onDrop: (files: File[] | null) => void): [Boolean, DropHandlers] => {
  const [isOverDropZone, setIsOverDropZone] = useState<Boolean>(false);
  const counter = useRef(0);

  const handlers: DropHandlers = useMemo(
    () => ({
      onDragOver(event) {
        event.preventDefault();
      },
      onDragEnter(event) {
        event.preventDefault();
        counter.current++;
        setIsOverDropZone(true);
      },
      onDragLeave(event) {
        event.preventDefault();
        counter.current--;
        if (counter.current === 0) {
          setIsOverDropZone(false);
        }
      },
      onDrop(event) {
        event.preventDefault();
        counter.current = 0;
        setIsOverDropZone(false);
        event.persist();
        const files = Array.from(event?.dataTransfer?.files ?? []);
        if (files.length === 0) {
          onDrop(null);
          return;
        }
        onDrop(files);
      },
    }),
    [onDrop],
  );

  return [isOverDropZone, handlers];
};

export default useDropZone;
