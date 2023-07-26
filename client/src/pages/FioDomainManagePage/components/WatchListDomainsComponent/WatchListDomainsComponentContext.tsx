import { useCallback, useState } from 'react';

import { useCheckIfSmallDesktop } from '../../../../screenType';

type UseContextProps = {
  isSmallDesktop: boolean;
  showModal: boolean;
  closeModal: () => void;
  openModal: () => void;
};

export const useContext = (): UseContextProps => {
  const isSmallDesktop = useCheckIfSmallDesktop();

  const [showModal, toggleShowModal] = useState<boolean>(false);

  const openModal = useCallback(() => {
    toggleShowModal(true);
  }, []);
  const closeModal = useCallback(() => {
    toggleShowModal(false);
  }, []);

  return {
    isSmallDesktop,
    showModal,
    closeModal,
    openModal,
  };
};
