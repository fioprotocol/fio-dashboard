import React, { useState } from 'react';

import EditWalletNameModal from '../EditWalletNameModal';

import apis from '../../../../api';

import { EditWalletNameValues } from '../../types';
import { FioWalletDoublet } from '../../../../types';

type Props = {
  show: boolean;
  genericErrorModalIsActive: boolean;
  fioWallet: FioWalletDoublet;
  onClose: () => void;
  onSuccess: () => void;
  showGenericErrorModal: () => void;
  updateWalletName: (data: { publicKey: string; name: string }) => void;
};

const EditWalletName: React.FC<Props> = props => {
  const {
    show,
    genericErrorModalIsActive,
    showGenericErrorModal,
    onClose,
    updateWalletName,
    fioWallet,
    onSuccess,
  } = props;
  const [processing, setProcessing] = useState(false);
  const [currentValues, setCurrentValues] = useState<EditWalletNameValues>({
    name: fioWallet.name,
  });

  const onEditSubmit = (values: EditWalletNameValues) => {
    setCurrentValues(values);
    edit(values.name);
  };

  const edit = async (name: string) => {
    setProcessing(true);
    try {
      const res = await apis.account.updateWallet(fioWallet.publicKey, {
        name,
      });

      if (res.success) {
        updateWalletName({ publicKey: fioWallet.publicKey, name });
        onSuccess();
      } else {
        showGenericErrorModal();
      }
    } catch (e) {
      showGenericErrorModal();
    }

    setProcessing(false);
  };

  const onModalClose = () => {
    if (!processing) {
      onClose();
    }
  };

  return (
    <EditWalletNameModal
      show={show && !genericErrorModalIsActive}
      onClose={onModalClose}
      loading={processing}
      onSubmit={onEditSubmit}
      initialValues={currentValues}
    />
  );
};

export default EditWalletName;
