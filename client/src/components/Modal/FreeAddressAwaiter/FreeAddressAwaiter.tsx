import React, { useEffect } from 'react';

import apis from '../../../api';
import Modal from '../Modal';
import FioLoader from '../../common/FioLoader/FioLoader';

import { FioAddressDoublet, User } from '../../../types';
import classes from '../Modal.module.scss';
import { minWaitTimeFunction } from '../../../utils';

const WAIT_TIMEOUT = 3000; // 3 sec

type Props = {
  showFreeAddressAwaiter: boolean;
  user: User;
  fioAddresses: FioAddressDoublet[];
  isAuthenticated: boolean;
  isRefFlow: boolean;
  toggleFreeAddressAwaiter: () => void;
};

const FreeAddressAwaiter: React.FC<Props> = props => {
  const {
    showFreeAddressAwaiter,
    toggleFreeAddressAwaiter,
    isAuthenticated,
    isRefFlow,
    user,
    fioAddresses,
  } = props;

  const checkAddressIsRegistered = async (fioAddress: string) => {
    try {
      const { is_registered } = await minWaitTimeFunction(
        () => apis.fio.availCheck(fioAddress),
        WAIT_TIMEOUT,
      );
      if (is_registered) return toggleFreeAddressAwaiter();
    } catch (e) {
      //
    }
    setTimeout(() => {
      checkAddressIsRegistered(fioAddress);
    }, WAIT_TIMEOUT);
  };

  useEffect(() => {
    if (
      isAuthenticated &&
      showFreeAddressAwaiter &&
      isRefFlow &&
      !fioAddresses.length
    ) {
      const { freeAddresses } = user;
      if (freeAddresses.length) {
        checkAddressIsRegistered(freeAddresses[0].name);
      }
    }
  }, [user, isAuthenticated, showFreeAddressAwaiter, isRefFlow, fioAddresses]);

  if (!showFreeAddressAwaiter || !isAuthenticated) return null;

  return (
    <Modal
      show={showFreeAddressAwaiter}
      hideCloseButton={true}
      closeButton={null}
      onClose={() => null}
    >
      <div className="d-flex flex-column align-items-center justify-content-center p-4">
        <h4 className="mb-4 text-center">
          Waiting to confirm your FIO Address is registered
        </h4>
        <p className={`pb-4 text-center ${classes.smallText}`}>
          If you see this window for a long time please contact support. Thank
          you.
        </p>
        <FioLoader />
      </div>
    </Modal>
  );
};

export default FreeAddressAwaiter;
