import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import FioDomainStatusChangeForm from './components/FioDomainStatusChangeForm';
import WalletAction from '../../components/WalletAction/WalletAction';
import SetVisibilityResults from '../../components/common/TransactionResults/components/SetVisibilityResults';
import FioDomainStatusEdgeWallet from './components/FioDomainStatusEdgeWallet';
import FioDomainStatusLedgerWallet from './components/FioDomainStatusLedgerWallet';
import PageTitle from '../../components/PageTitle/PageTitle';
import { FioDomainStatusChangeMetamaskWallet } from './components/FioDomainStatusChangeMetamaskWallet';

import { CONFIRM_PIN_ACTIONS, DOMAIN_STATUS } from '../../constants/common';
import { ROUTES } from '../../constants/routes';

import { LINKS } from '../../constants/labels';

import { useWalletBalances } from '../../util/hooks';
import MathOp from '../../util/math';
import { convertFioPrices } from '../../util/prices';

import { FioDomainStatusValues, ContainerProps } from './types';
import { ResultsData } from '../../components/common/TransactionResults/types';
import { handleFioServerResponse } from '../../util/fio';
import { OnSuccessResponseResult } from '../../components/MetamaskConfirmAction';

const FioDomainStatusChangePage: React.FC<ContainerProps> = props => {
  const {
    location,
    history,
    roe,
    feePrice,
    fioWallet,
    selectedFioDomain,
    refreshBalance,
    getFee,
  } = props;
  const { name, backPath } = location.query;

  const domainStatus: string = selectedFioDomain?.isPublic
    ? DOMAIN_STATUS.PUBLIC
    : DOMAIN_STATUS.PRIVATE;
  const statusToChange =
    domainStatus === DOMAIN_STATUS.PRIVATE
      ? DOMAIN_STATUS.PUBLIC
      : DOMAIN_STATUS.PRIVATE;

  const publicStatusToSet = selectedFioDomain?.isPublic ? 0 : 1;

  const [submitData, setSubmitData] = useState<FioDomainStatusValues | null>(
    null,
  );
  const [processing, setProcessing] = useState(false);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  const { available: walletBalancesAvailable } = useWalletBalances(
    fioWallet.publicKey,
  );

  useEffect(() => {
    getFee();
    selectedFioDomain?.walletPublicKey &&
      refreshBalance(selectedFioDomain?.walletPublicKey);
  }, [getFee, refreshBalance, selectedFioDomain?.walletPublicKey]);

  const onSubmit = () => {
    setSubmitData({
      publicStatusToSet,
      name,
    });
  };
  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };
  const onSuccess = (
    result: { fee_collected: number } | OnSuccessResponseResult,
  ) => {
    setSubmitData(null);

    let feeCollected: number;

    if ('fee_collected' in result) {
      feeCollected = result.fee_collected;
    } else {
      if (!Array.isArray(result) && 'transaction_id' in result) {
        feeCollected = handleFioServerResponse(result).fee_collected;
      }
    }

    setResultsData({
      feeCollected:
        feeCollected && roe ? convertFioPrices(feeCollected, roe) : feePrice,
      name,
      changedStatus: statusToChange,
      payWith: {
        walletName: fioWallet.name,
        walletBalances: walletBalancesAvailable,
      },
    });
    setProcessing(false);
  };
  const onResultsClose = () => {
    history.push(backPath || ROUTES.FIO_DOMAINS);
  };
  const onResultsRetry = () => {
    setResultsData(null);
  };

  const hasLowBalance =
    feePrice &&
    new MathOp(walletBalancesAvailable.nativeFio || 0).lt(
      feePrice.nativeFio || 0,
    );

  if (resultsData)
    return (
      <>
        <PageTitle
          link={LINKS.FIO_DOMAIN_STATUS_CHANGE_CONFIRMATION}
          isVirtualPage
        />
        <SetVisibilityResults
          results={resultsData}
          title={
            resultsData.error
              ? 'Domain Status Change Failed!'
              : 'Domain Status Changed!'
          }
          hasAutoWidth={true}
          onClose={onResultsClose}
          onRetry={onResultsRetry}
        />
      </>
    );

  if (!selectedFioDomain?.walletPublicKey && !processing)
    return <Redirect to={{ pathname: backPath || ROUTES.FIO_DOMAINS }} />;

  return (
    <>
      <WalletAction
        fioWallet={fioWallet}
        fee={feePrice.nativeFio}
        onCancel={onCancel}
        onSuccess={onSuccess}
        submitData={submitData}
        processing={processing}
        setProcessing={setProcessing}
        action={CONFIRM_PIN_ACTIONS.SET_VISIBILITY}
        FioActionWallet={FioDomainStatusEdgeWallet}
        LedgerActionWallet={FioDomainStatusLedgerWallet}
        MetamaskActionWallet={FioDomainStatusChangeMetamaskWallet}
      />

      <FioDomainStatusChangeForm
        statusToChange={statusToChange}
        feePrice={feePrice}
        name={name}
        hasLowBalance={hasLowBalance}
        processing={processing}
        handleSubmit={onSubmit}
        fioWallet={fioWallet}
        walletBalancesAvailable={walletBalancesAvailable}
        backLink={backPath}
      />
    </>
  );
};

export default FioDomainStatusChangePage;
