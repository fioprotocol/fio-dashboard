import React, { useCallback } from 'react';

import Modal from '../../../components/Modal/Modal';
import { AffiliateSelectFCHModal } from './AffiliateSelectFCHModal';
import { AffiliateNoFCHModal } from './AffiliateNoFCHModal';

import { FioAddressDoublet } from '../../../types';
import { FormValuesProps } from '../types';

type Props = {
  showModal: boolean;
  onCloseModal: () => void;
  fioAddresses: FioAddressDoublet[];
  activateAffiliate: (fch: string) => void;
};

export const AffiliateModal: React.FC<Props> = props => {
  const { showModal, onCloseModal, fioAddresses, activateAffiliate } = props;

  const onAffiliateActivate = useCallback(
    (values: FormValuesProps) => {
      activateAffiliate(values.fch);
      onCloseModal();
    },
    [activateAffiliate, onCloseModal],
  );

  return (
    <Modal
      show={showModal}
      onClose={onCloseModal}
      closeButton
      isSimple
      isMiddleWidth
      hasDefaultCloseColor
    >
      {fioAddresses.length > 0 ? (
        <AffiliateSelectFCHModal
          onAffiliateActivate={onAffiliateActivate}
          fioAddresses={fioAddresses}
        />
      ) : (
        <AffiliateNoFCHModal />
      )}
    </Modal>
  );
};
