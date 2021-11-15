import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import PseudoModalContainer from '../PseudoModalContainer';
import InfoBadge from '../InfoBadge/InfoBadge';
import PriceBadge from '../Badges/PriceBadge/PriceBadge';
import PayWithBadge from '../Badges/PayWithBadge/PayWithBadge';
import LowBalanceBadge from '../Badges/LowBalanceBadge/LowBalanceBadge';
import RenewResults from '../common/TransactionResults/components/RenewResults';
import EdgeConfirmAction from '../EdgeConfirmAction';

import {
  MANAGE_PAGE_REDIRECT,
  CONFIRM_PIN_ACTIONS,
} from '../../constants/common';
import { BADGE_TYPES } from '../Badge/Badge';
import { ERROR_TYPES } from '../common/TransactionResults/Results';

import { setFees } from '../../util/prices';
import { hasFioAddressDelimiter } from '../../utils';

import { ContainerProps } from './types';
import { ResultsData } from '../common/TransactionResults/types';
import { SubmitActionParams } from '../EdgeConfirmAction/types';

import apis from '../../api';

import classes from './FioNameRenewContainer.module.scss';

const FioNameRenewContainer: React.FC<ContainerProps> = props => {
  const {
    currentWallet,
    fee,
    roe,
    history,
    name,
    fioNameType,
    refreshBalance,
    getFee,
  } = props;

  const feePrice = setFees(fee, roe);
  const { costFio, costUsdc } = feePrice;
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<{
    fioAddress: string;
  } | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  useEffect(() => {
    getFee(hasFioAddressDelimiter(name));
    refreshBalance(currentWallet.publicKey);
  }, []);

  const submit = async ({ keys }: SubmitActionParams) => {
    apis.fio.setWalletFioSdk(keys);
    try {
      const result = await apis.fio.renew(name, feePrice.nativeFio);
      apis.fio.clearWalletFioSdk();
      return result;
    } catch (e) {
      apis.fio.clearWalletFioSdk();
      throw e;
    }
  };

  const hasLowBalance =
    currentWallet && feePrice && currentWallet.balance < feePrice.costFio;

  const onSubmit = () => {
    setSubmitData({ fioAddress: name });
  };
  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };
  const onSuccess = async (result: { fee_collected: number }) => {
    setResultsData({
      feeCollected: setFees(result.fee_collected, roe) || feePrice,
      name,
    });
    setSubmitData(null);
    setProcessing(false);
  };

  const onResultsClose = () => {
    history.push(MANAGE_PAGE_REDIRECT[fioNameType]);
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };

  if (resultsData)
    return (
      <RenewResults
        results={resultsData}
        title={resultsData.error ? 'Renewed Failed!' : 'Renewed!'}
        onClose={onResultsClose}
        onRetry={onResultsRetry}
        errorType={ERROR_TYPES.RENEW_ERROR}
      />
    );

  if (!currentWallet.publicKey && !processing)
    return <Redirect to={{ pathname: MANAGE_PAGE_REDIRECT[fioNameType] }} />;

  return (
    <>
      <EdgeConfirmAction
        action={CONFIRM_PIN_ACTIONS.RENEW}
        setProcessing={setProcessing}
        onSuccess={onSuccess}
        onCancel={onCancel}
        processing={processing}
        data={submitData}
        submitAction={submit}
        fioWalletEdgeId={currentWallet.id || ''}
        edgeAccountLogoutBefore={true}
      />
      <PseudoModalContainer
        title="Renew Now"
        link={MANAGE_PAGE_REDIRECT[fioNameType]}
      >
        <div className={classes.container}>
          <InfoBadge
            title="Renewal Information"
            message="This renewal will add 365 days to expiration and 100 Bundle Transactions"
            show={true}
            type={BADGE_TYPES.INFO}
          />
          <h5 className={classes.label}>Renew Details</h5>
          <PriceBadge
            costFio={costFio}
            costUsdc={costUsdc}
            title={name}
            type={BADGE_TYPES.WHITE}
          />
          <h5 className={classes.label}>Payment Details</h5>
          <PriceBadge
            costFio={costFio}
            costUsdc={costUsdc}
            title="Total Cost"
            type={BADGE_TYPES.BLACK}
          />
          <PayWithBadge
            costFio={costFio}
            costUsdc={costUsdc}
            currentWallet={currentWallet}
          />
          <LowBalanceBadge hasLowBalance={hasLowBalance} />
          <Button
            onClick={onSubmit}
            className={classes.button}
            disabled={hasLowBalance || processing}
          >
            Renew Now
          </Button>
        </div>
      </PseudoModalContainer>
    </>
  );
};

export default FioNameRenewContainer;
