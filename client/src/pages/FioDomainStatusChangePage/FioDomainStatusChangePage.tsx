import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import FioDomainStatusChangeForm from './components/FioDomainStatusChangeForm';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';
import SetVisibilityResults from '../../components/common/TransactionResults/components/SetVisibilityResults';

import { CONFIRM_PIN_ACTIONS, DOMAIN_STATUS } from '../../constants/common';
import { ROUTES } from '../../constants/routes';
import { setFees } from '../../util/prices';

import apis from '../../api';

import { ContainerProps } from './types';
import { ResultsData } from '../../components/common/TransactionResults/types';
import { SubmitActionParams } from '../../components/EdgeConfirmAction/types';

const FioDomainStatusChangePage: React.FC<ContainerProps> = props => {
  const {
    match,
    history,
    roe,
    fees,
    fioWallet,
    selectedFioDomain,
    refreshBalance,
    getFee,
  } = props;
  const { id: name } = match.params;

  const feePrice = setFees(
    fees[apis.fio.actionEndPoints.setFioDomainPublic] || 0,
    roe,
  );
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

  useEffect(() => {
    getFee();
    refreshBalance(selectedFioDomain.walletPublicKey);
  }, []);

  // Submit
  const submit = async ({ keys }: SubmitActionParams) => {
    apis.fio.setWalletFioSdk(keys);
    try {
      const result = await apis.fio.setDomainVisibility(
        name,
        statusToChange === DOMAIN_STATUS.PUBLIC,
        feePrice.nativeFio,
      );
      apis.fio.clearWalletFioSdk();
      return result;
    } catch (e) {
      apis.fio.clearWalletFioSdk();
      throw e;
    }
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
      feeCollected: result.fee_collected
        ? setFees(result.fee_collected, roe)
        : feePrice,
      name,
      changedStatus: domainStatus,
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
    fioWallet && feePrice && fioWallet.balance < feePrice.costFio;

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
        fioWalletEdgeId={fioWallet.id || ''}
        edgeAccountLogoutBefore={true}
      />
      <FioDomainStatusChangeForm
        statusToChange={statusToChange}
        fioWallet={fioWallet}
        feePrice={feePrice}
        name={name}
        hasLowBalance={hasLowBalance}
        processing={processing}
        handleSubmit={onSubmit}
      />
    </>
  );
};

export default FioDomainStatusChangePage;
