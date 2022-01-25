import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';

import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';

import { FioWalletDoublet } from '../../../types';

type Props = {
  submitData: any | null;
  processing: boolean;
  fioWallet: FioWalletDoublet;
  setProcessing: (processing: boolean) => void;
  onSuccess: (data: any) => void;
  onCancel: () => void;
};

const processingProps = {
  title: 'Decrypting content',
  message: 'Hang tight while we are decrypting content',
};

const decryptContent = ({ data }: SubmitActionParams) => {
  // todo: remove mocked data
  const mockedData = [
    {
      amount: '0.01',
      chain: 'BTC',
      memo: 'Some text',
      payeePublicAddress: 'test',
      txId: 'tester22',
    },
    {
      amount: '200',
      chain: 'FIO',
      memo: 'Some text',
      payeePublicAddress: 'test',
      txId: 'test',
    },
    {
      amount: '220',
      chain: 'FIO',
      memo: 'Some text',
      payeePublicAddress: 'test22',
    },
    {
      amount: '0.5',
      chain: 'ETH',
      memo: 'Some text',
      payeePublicAddress: 'test',
      txId: 'tester',
    },
  ];

  return {
    ...data,
    content: mockedData[Math.floor(Math.random() * mockedData.length)],
  };
};

const DecryptContentEdge: React.FC<Props> = props => {
  const {
    onSuccess,
    onCancel,
    submitData,
    processing,
    setProcessing,
    fioWallet,
  } = props;

  return (
    <div>
      <EdgeConfirmAction
        onSuccess={onSuccess}
        onCancel={onCancel}
        submitAction={decryptContent}
        data={submitData}
        action={CONFIRM_PIN_ACTIONS.DETAILED_FIO_REQUEST}
        processing={processing}
        setProcessing={setProcessing}
        fioWalletEdgeId={fioWallet.edgeId || ''}
        processingProps={processingProps}
      />
    </div>
  );
};

export default DecryptContentEdge;
