import React from 'react';

import Loader from '../../../../../components/Loader/Loader';
import Modal from '../../../../../components/Modal/Modal';
import { TabUIContainer } from '../TabUIContainer';
import { PublicAddressComponent } from './components/PublicAddressComponent';
import { PublicAddressDetailsComponent } from './components/PublicAddressDetailsComponent';

import { useContext } from './PaymentsTabComponentContext';

import { genericTokenId } from '../../../../../util/fio';

type Props = {
  fch: string;
};

const content = {
  title: 'Payment Options',
  subtitle:
    'Payments can be made to any of the following mapped cryptocurrencies',
};

export const PaymentsTabComponent: React.FC<Props> = props => {
  const { fch } = props;
  const {
    activePublicAddress,
    loading,
    publicAddresses,
    showModal,
    onModalClose,
    onItemClick,
  } = useContext({
    fch,
  });

  return (
    <>
      <TabUIContainer {...content}>
        {loading ? (
          <Loader />
        ) : (
          publicAddresses.map(pubAddress => {
            const key = genericTokenId(
              pubAddress.chainCode,
              pubAddress.tokenCode,
              pubAddress.publicAddress,
            );
            return (
              <PublicAddressComponent
                key={key}
                publicAddressItem={pubAddress}
                onItemClick={onItemClick}
              />
            );
          })
        )}
      </TabUIContainer>
      <Modal
        show={showModal}
        onClose={onModalClose}
        closeButton
        isSimple
        hasDefaultCloseColor
        isWide
      >
        <PublicAddressDetailsComponent {...activePublicAddress} fch={fch} />
      </Modal>
    </>
  );
};
