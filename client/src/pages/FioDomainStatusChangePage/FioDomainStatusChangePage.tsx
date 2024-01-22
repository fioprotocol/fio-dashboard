import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import FioDomainStatusChangeForm from './components/FioDomainStatusChangeForm';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';
import SetVisibilityResults from '../../components/common/TransactionResults/components/SetVisibilityResults';
import LedgerWalletActionNotSupported from '../../components/LedgerWalletActionNotSupported';
import PageTitle from '../../components/PageTitle/PageTitle';
import { FioDomainStatusChangeMetamaskWallet } from './components/FioDomainStatusChangeMetamaskWallet';

import {
  CONFIRM_PIN_ACTIONS,
  DOMAIN_STATUS,
  WALLET_CREATED_FROM,
} from '../../constants/common';
import { ROUTES } from '../../constants/routes';
import { ACTIONS, DEFAULT_MAX_FEE_MULTIPLE_AMOUNT } from '../../constants/fio';
import { LINKS } from '../../constants/labels';

import { useWalletBalances } from '../../util/hooks';
import MathOp from '../../util/math';
import { convertFioPrices } from '../../util/prices';

import apis from '../../api';

import { ContainerProps } from './types';
import { ResultsData } from '../../components/common/TransactionResults/types';
import { SubmitActionParams } from '../../components/EdgeConfirmAction/types';

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
  const { name } = location.query;

  const domainStatus: string = selectedFioDomain?.isPublic
    ? DOMAIN_STATUS.PUBLIC
    : DOMAIN_STATUS.PRIVATE;
  const statusToChange =
    domainStatus === DOMAIN_STATUS.PRIVATE
      ? DOMAIN_STATUS.PUBLIC
      : DOMAIN_STATUS.PRIVATE;

  const [submitData, setSubmitData] = useState<string | null>(null);
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

  // Submit
  const submit = async ({ keys }: SubmitActionParams) => {
    return await apis.fio.executeAction(keys, ACTIONS.setFioDomainVisibility, {
      fioDomain: name,
      isPublic: statusToChange === DOMAIN_STATUS.PUBLIC,
      maxFee: new MathOp(feePrice.nativeFio)
        .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
        .round(0)
        .toNumber(),
    });
  };

  const onSubmit = () => {
    setSubmitData(statusToChange);
  };
  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };
  const onSuccess = (result: { fee_collected: number }) => {
    setSubmitData(null);
    setResultsData({
      feeCollected:
        result.fee_collected && roe
          ? convertFioPrices(result.fee_collected, roe)
          : feePrice,
      name,
      changedStatus: statusToChange,
    });
    setProcessing(false);
  };
  const onResultsClose = () => {
    history.push(ROUTES.FIO_DOMAINS);
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
    return <Redirect to={{ pathname: ROUTES.FIO_DOMAINS }} />;

  return (
    <>
      {fioWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <EdgeConfirmAction
          action={CONFIRM_PIN_ACTIONS.SET_VISIBILITY}
          setProcessing={setProcessing}
          onSuccess={onSuccess}
          onCancel={onCancel}
          processing={processing}
          data={submitData}
          submitAction={submit}
          fioWalletEdgeId={fioWallet.edgeId || ''}
          edgeAccountLogoutBefore={true}
        />
      ) : null}

      {fioWallet.from === WALLET_CREATED_FROM.LEDGER ? (
        <LedgerWalletActionNotSupported
          submitData={submitData}
          onCancel={onCancel}
        />
      ) : null}

      {fioWallet.from === WALLET_CREATED_FROM.METAMASK ? (
        <FioDomainStatusChangeMetamaskWallet
          derivationIndex={fioWallet?.data?.derivationIndex}
          processing={processing}
          submitData={{ isPublic: selectedFioDomain.isPublic, name }}
          startProcessing={!!submitData}
          onSuccess={onSuccess}
          onCancel={onCancel}
          setProcessing={setProcessing}
        />
      ) : null}

      <FioDomainStatusChangeForm
        statusToChange={statusToChange}
        feePrice={feePrice}
        name={name}
        hasLowBalance={hasLowBalance}
        processing={processing}
        handleSubmit={onSubmit}
        fioWallet={fioWallet}
        walletBalancesAvailable={walletBalancesAvailable}
      />
    </>
  );
};

export default FioDomainStatusChangePage;
