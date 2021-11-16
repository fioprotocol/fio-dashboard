import React, { useEffect, useState } from 'react';

import CreateWalletModal from '../CreateWalletModal';
import CreateEdgeWallet from './CreateEdgeWallet';
import { CreateWalletValues } from '../../types';
import { FioWalletDoublet, NewFioWalletDoublet } from '../../../../types';
import { WALLET_CREATED_FROM } from '../../../../constants/common';

import Processing from '../../../../components/common/TransactionProcessing';

const DEFAULT_WALLET_NAME = 'My FIO Wallet';

type Props = {
  show: boolean;
  genericErrorModalIsActive: boolean;
  addWalletLoading: boolean;
  fioWallets: FioWalletDoublet[];
  onClose: () => void;
  onWalletCreated: () => void;
  addWallet: (data: NewFioWalletDoublet) => void;
};

const CreateWallet: React.FC<Props> = props => {
  const {
    show,
    genericErrorModalIsActive,
    addWalletLoading,
    onClose,
    addWallet,
    fioWallets,
    onWalletCreated,
  } = props;
  const [creationType, setCreationType] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currentValues, setCurrentValues] = useState<CreateWalletValues>({
    name: '',
    ledger: false,
  });

  useEffect(() => {
    if (show) {
      const newWalletCount =
        fioWallets.filter(({ from }) => from === WALLET_CREATED_FROM.EDGE)
          .length + 1;
      const defaultName = `${DEFAULT_WALLET_NAME} ${newWalletCount}`;

      setCurrentValues({
        name: defaultName,
        ledger: false,
      });
    }
  }, [show]);

  useEffect(() => {
    if (processing && !addWalletLoading) {
      onWalletCreated();
      setProcessing(false);
    }
  }, [addWalletLoading]);

  const onCreateSubmit = (values: CreateWalletValues) => {
    setCurrentValues(values);
    setCreationType(
      values.ledger ? WALLET_CREATED_FROM.LEDGER : WALLET_CREATED_FROM.EDGE,
    );
  };

  const onWalletDataPrepared = (walletData: NewFioWalletDoublet) => {
    addWallet(walletData);
    setCreationType(null);
  };

  const onOptionCancel = () => {
    setCreationType(null);
    setProcessing(false);
  };

  return (
    <>
      <Processing isProcessing={processing || addWalletLoading} />
      {creationType === WALLET_CREATED_FROM.EDGE ? (
        <CreateEdgeWallet
          setProcessing={setProcessing}
          processing={processing}
          values={currentValues}
          onWalletDataPrepared={onWalletDataPrepared}
          onOptionCancel={onOptionCancel}
          {...props}
        />
      ) : null}
      <CreateWalletModal
        show={
          show &&
          !creationType &&
          !processing &&
          !genericErrorModalIsActive &&
          !addWalletLoading
        }
        onClose={onClose}
        loading={processing}
        onSubmit={onCreateSubmit}
        initialValues={currentValues}
      />
    </>
  );
};

export default CreateWallet;
