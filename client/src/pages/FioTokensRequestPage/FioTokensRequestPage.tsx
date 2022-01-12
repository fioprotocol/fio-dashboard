import React, { useState, useEffect } from 'react';

import FioLoader from '../../components/common/FioLoader/FioLoader';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import RequestTokensForm from './components/RequestTokensForm';
import RequestTokensEdgeWallet from './components/RequestTokensEdgeWallet';
import TokenTransferResults from '../../components/common/TransactionResults/components/TokenTransferResults';

import { putParamsToUrl } from '../../utils';
import { useFioCryptoHandles } from '../../util/hooks';

import { ContainerProps, RequestTokensValues } from './types';
import { FioCryptoHandleDoublet } from '../../types';
import { TrxResponse } from '../../api/fio';
import { ResultsData } from '../../components/common/TransactionResults/types';

import apis from '../../api';

import { BADGE_TYPES } from '../../components/Badge/Badge';
import { ROUTES } from '../../constants/routes';
import { WALLET_CREATED_FROM } from '../../constants/common';

import classes from './styles/RequestTokensPage.module.scss';

const RequestPage: React.FC<ContainerProps> = props => {
  const {
    fioWallet,
    fioCryptoHandles,
    balance,
    loading,
    roe,
    history,
    refreshBalance,
  } = props;

  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [requestData, setRequestData] = useState<RequestTokensValues | null>(
    null,
  );
  const [processing, setProcessing] = useState<boolean>(false);

  useFioCryptoHandles();

  useEffect(() => {
    setRequestData(null);
  }, []);

  useEffect(() => {
    if (fioWallet && fioWallet.publicKey) refreshBalance(fioWallet.publicKey);
  }, [fioWallet]);

  const onRequest = async (values: RequestTokensValues) => {
    const newRequestData = { ...values };
    newRequestData.amount = apis.fio.amountToSUF(newRequestData.amount);
    setRequestData(newRequestData);
  };
  const onCancel = () => {
    setRequestData(null);
    setProcessing(false);
  };
  const onSuccess = (res: TrxResponse) => {
    setRequestData(null);
    setProcessing(false);
    setResultsData({
      name: fioWallet.publicKey,
      publicKey: fioWallet.publicKey,
      other: {
        ...requestData,
        ...res,
        to: requestData.payerFioAddress,
        from: requestData.payeeFioAddress,
      },
    });
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };
  const onResultsClose = () => {
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, { publicKey: fioWallet.publicKey }),
    );
  };

  if (!fioWallet || !fioWallet.id)
    return (
      <div className="d-flex justify-content-center align-items-center w-100 flex-grow-1">
        <FioLoader />
      </div>
    );

  const backTo = putParamsToUrl(ROUTES.FIO_WALLET, {
    publicKey: fioWallet.publicKey,
  });
  const walletFioCryptoHandles = fioCryptoHandles
    .filter(
      ({ walletPublicKey }: FioCryptoHandleDoublet) =>
        fioWallet.publicKey === walletPublicKey,
    )
    .sort(
      (
        fioCryptoHandle1: FioCryptoHandleDoublet,
        fioCryptoHandle2: FioCryptoHandleDoublet,
      ) => (fioCryptoHandle1.name > fioCryptoHandle2.name ? 1 : -1),
    );

  const renderInfoBadge = () =>
    fioCryptoHandles.length ? (
      <InfoBadge
        type={BADGE_TYPES.INFO}
        show={true}
        title="Requesting FIO Crypto Handle "
        message="You may use any of your FIO Crypto Handles associated with the wallet to create a FIO token request."
      />
    ) : null;

  if (resultsData)
    return (
      <TokenTransferResults
        results={resultsData}
        title={resultsData.error ? 'Request not Sent' : 'Request Sent'}
        titleTo="Request Sent To"
        titleFrom="Requesting FIO Crypto Handle"
        titleAmount="Amount Requested"
        roe={roe}
        onClose={onResultsClose}
        onRetry={onResultsRetry}
      />
    );

  return (
    <>
      {fioWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <RequestTokensEdgeWallet
          fioWallet={fioWallet}
          onCancel={onCancel}
          onSuccess={onSuccess}
          requestData={requestData}
          processing={processing}
          setProcessing={setProcessing}
        />
      ) : null}
      <PseudoModalContainer
        title="Request FIO Tokens"
        link={backTo || null}
        middleWidth={true}
      >
        <p className={classes.subtitle}>
          <span className={classes.subtitleThin}>FIO Wallet Name:</span>{' '}
          {fioWallet.name}
        </p>

        {renderInfoBadge()}

        <RequestTokensForm
          fioWallet={fioWallet}
          balance={balance}
          loading={loading || processing}
          fioCryptoHandles={walletFioCryptoHandles}
          onSubmit={onRequest}
        />
      </PseudoModalContainer>
    </>
  );
};

export default RequestPage;
