import React, { useState, useEffect } from 'react';

import FioLoader from '../../components/common/FioLoader/FioLoader';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import RequestTokensForm from './components/RequestTokensForm';
import RequestTokensEdgeWallet from './components/RequestTokensEdgeWallet';
import TokenTransferResults from '../../components/common/TransactionResults/components/TokenTransferResults';

import { putParamsToUrl } from '../../utils';
import { useFioAddresses } from '../../util/hooks';

import { ContainerProps, RequestTokensValues } from './types';
import { FioAddressDoublet } from '../../types';
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
    fioAddresses,
    balance,
    fioWalletsLoading,
    roe,
    history,
    contactsList,
    contactsLoading,
    refreshBalance,
    createContact,
    getContactsList,
  } = props;

  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [requestData, setRequestData] = useState<RequestTokensValues | null>(
    null,
  );
  const [processing, setProcessing] = useState<boolean>(false);

  const loading = fioWalletsLoading || contactsLoading;

  useFioAddresses();

  useEffect(() => {
    setRequestData(null);
    getContactsList();
  }, []);

  useEffect(() => {
    if (fioWallet && fioWallet.publicKey) refreshBalance(fioWallet.publicKey);
  }, [fioWallet]);

  const onRequest = async (values: RequestTokensValues) => {
    setRequestData(values);
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
        amount: requestData.amount,
        nativeAmount: apis.fio
          .amountToSUF(Number(requestData.amount))
          .toString(),
        ...res,
        toFioAddress: requestData.payerFioAddress,
        fromFioAddress: requestData.payeeFioAddress,
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
  const walletFioAddresses = fioAddresses
    .filter(
      ({ walletPublicKey }: FioAddressDoublet) =>
        fioWallet.publicKey === walletPublicKey,
    )
    .sort((fioAddress1: FioAddressDoublet, fioAddress2: FioAddressDoublet) =>
      fioAddress1.name > fioAddress2.name ? 1 : -1,
    );

  const renderInfoBadge = () =>
    fioAddresses.length ? (
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
          createContact={createContact}
          contactsList={contactsList}
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
          roe={roe}
          balance={balance}
          loading={loading || processing}
          fioAddresses={walletFioAddresses}
          onSubmit={onRequest}
          contactsList={contactsList}
        />
      </PseudoModalContainer>
    </>
  );
};

export default RequestPage;
