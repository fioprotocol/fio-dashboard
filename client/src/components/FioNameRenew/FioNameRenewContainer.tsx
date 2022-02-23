import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import PseudoModalContainer from '../PseudoModalContainer';
import InfoBadge from '../InfoBadge/InfoBadge';
import PriceBadge from '../Badges/PriceBadge/PriceBadge';
import PayWithBadge from '../Badges/PayWithBadge/PayWithBadge';
import LowBalanceBadge from '../Badges/LowBalanceBadge/LowBalanceBadge';
import RenewResults from '../common/TransactionResults/components/RenewResults';
import EdgeConfirmAction from '../EdgeConfirmAction';
import SubmitButton from '../common/SubmitButton/SubmitButton';

import {
  MANAGE_PAGE_REDIRECT,
  CONFIRM_PIN_ACTIONS,
} from '../../constants/common';
import { BADGE_TYPES } from '../Badge/Badge';
import { ERROR_TYPES } from '../common/TransactionResults/constants';
import { ACTIONS } from '../../constants/fio';

import { convertFioPrices } from '../../util/prices';
import { hasFioAddressDelimiter, isDomain } from '../../utils';
import { useWalletBalances } from '../../util/hooks';
import MathOp from '../../util/math';

import { ContainerProps } from './types';
import { ResultsData } from '../common/TransactionResults/types';
import { SubmitActionParams } from '../EdgeConfirmAction/types';

import apis from '../../api';

import classes from './FioNameRenewContainer.module.scss';

const FioNameRenewContainer: React.FC<ContainerProps> = props => {
  const {
    currentWallet,
    feePrice,
    roe,
    history,
    name,
    fioNameType,
    refreshBalance,
    getFee,
  } = props;

  const { nativeFio: feeNativeFio, fio, usdc } = feePrice;
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<{
    fioAddress: string;
  } | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  const { available: walletBalancesAvailable } = useWalletBalances(
    currentWallet.publicKey,
  );

  useEffect(() => {
    getFee(hasFioAddressDelimiter(name));
    refreshBalance(currentWallet.publicKey);
  }, []);

  const submit = async ({ keys }: SubmitActionParams) => {
    if (isDomain(name)) {
      return await apis.fio.executeAction(keys, ACTIONS.renewFioDomain, {
        fioDomain: name,
        maxFee: feeNativeFio,
      });
    }

    throw new Error("Can't renew FIO Crypto Handle");
  };

  const hasLowBalance =
    currentWallet &&
    feePrice &&
    new MathOp(walletBalancesAvailable.nativeFio).lt(feeNativeFio);

  const onSubmit = () => {
    setSubmitData({ fioAddress: name });
  };
  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };
  const onSuccess = async (result: { fee_collected: number }) => {
    setResultsData({
      feeCollected: convertFioPrices(result.fee_collected, roe) || feePrice,
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
        fioWalletEdgeId={currentWallet.edgeId || ''}
        edgeAccountLogoutBefore={true}
      />
      <PseudoModalContainer
        title="Renew Now"
        link={MANAGE_PAGE_REDIRECT[fioNameType]}
      >
        <div className={classes.container}>
          <InfoBadge
            title="Renewal Information"
            message="This renewal will add 365 days to expiration and 100 Bundled Transactions"
            show={true}
            type={BADGE_TYPES.INFO}
          />
          <h5 className={classes.label}>Renew Details</h5>
          <PriceBadge
            costNativeFio={feeNativeFio}
            costFio={fio}
            costUsdc={usdc}
            title={name}
            type={BADGE_TYPES.WHITE}
          />
          <h5 className={classes.label}>Payment Details</h5>
          <PriceBadge
            costNativeFio={feeNativeFio}
            costFio={fio}
            costUsdc={usdc}
            title="Total Cost"
            type={BADGE_TYPES.BLACK}
          />
          <PayWithBadge walletBalances={walletBalancesAvailable} />
          <LowBalanceBadge hasLowBalance={hasLowBalance} />
          <SubmitButton
            onClick={onSubmit}
            text="Renew Now"
            disabled={hasLowBalance || processing}
            loading={processing}
            withTopMargin={true}
          />
        </div>
      </PseudoModalContainer>
    </>
  );
};

export default FioNameRenewContainer;
