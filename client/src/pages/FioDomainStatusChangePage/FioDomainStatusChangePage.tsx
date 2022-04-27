import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import FioDomainStatusChangeForm from './components/FioDomainStatusChangeForm';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';
import SetVisibilityResults from '../../components/common/TransactionResults/components/SetVisibilityResults';

import { CONFIRM_PIN_ACTIONS, DOMAIN_STATUS } from '../../constants/common';
import { ROUTES } from '../../constants/routes';
import { ACTIONS } from '../../constants/fio';
import { useWalletBalances } from '../../util/hooks';
import MathOp from '../../util/math';

import { convertFioPrices } from '../../util/prices';

import apis from '../../api';

import { ContainerProps } from './types';
import { ResultsData } from '../../components/common/TransactionResults/types';
import { SubmitActionParams } from '../../components/EdgeConfirmAction/types';

const FioDomainStatusChangePage: React.FC<ContainerProps> = props => {
  const {
    match,
    history,
    roe,
    feePrice,
    fioWallet,
    selectedFioDomain,
    refreshBalance,
    getFee,
  } = props;
  const { id: name } = match.params;

  const domainStatus: string = selectedFioDomain.isPublic
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
    selectedFioDomain.walletPublicKey &&
      refreshBalance(selectedFioDomain.walletPublicKey);
  }, []);

  // Submit
  const submit = async ({ keys }: SubmitActionParams) => {
    return await apis.fio.executeAction(keys, ACTIONS.setFioDomainVisibility, {
      fioDomain: name,
      isPublic: statusToChange === DOMAIN_STATUS.PUBLIC,
      maxFee: feePrice.nativeFio,
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
    );

  if (!selectedFioDomain.walletPublicKey && !processing)
    return <Redirect to={{ pathname: ROUTES.FIO_DOMAINS }} />;

  return (
    <>
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
      <FioDomainStatusChangeForm
        statusToChange={statusToChange}
        feePrice={feePrice}
        name={name}
        hasLowBalance={hasLowBalance}
        processing={processing}
        handleSubmit={onSubmit}
        walletName={fioWallet.name}
        walletBalancesAvailable={walletBalancesAvailable}
      />
    </>
  );
};

export default FioDomainStatusChangePage;
