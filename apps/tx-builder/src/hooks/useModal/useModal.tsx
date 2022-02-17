import { useCallback, useState } from 'react';

function useModal(initialValue = false) {
  const [open, setOpen] = useState<boolean>(initialValue);

  const openModal = useCallback(() => {
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  return {
    open,
    setOpen,

    openModal,
    closeModal,
    toggleModal,
  };
}

export default useModal;
