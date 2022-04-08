import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import PseudoModalContainer from '../PseudoModalContainer';
import InfoBadge from '../InfoBadge/InfoBadge';
import PriceBadge from '../Badges/PriceBadge/PriceBadge';
import PayWithBadge from '../Badges/PayWithBadge/PayWithBadge';
import LowBalanceBadge from '../Badges/LowBalanceBadge/LowBalanceBadge';
import RenewResults from '../common/TransactionResults/components/RenewResults';
import RenewEdgeWallet from './components/RenewEdgeWallet';
import SubmitButton from '../common/SubmitButton/SubmitButton';
import FioLoader from '../common/FioLoader/FioLoader';

import {
  DOMAIN,
  MANAGE_PAGE_REDIRECT,
  WALLET_CREATED_FROM,
} from '../../constants/common';
import { BADGE_TYPES } from '../Badge/Badge';
import { ERROR_TYPES } from '../common/TransactionResults/constants';

import { convertFioPrices } from '../../util/prices';
import { hasFioAddressDelimiter } from '../../utils';
import { useWalletBalances } from '../../util/hooks';
import MathOp from '../../util/math';

import { ContainerProps } from './types';
import { ResultsData } from '../common/TransactionResults/types';

import classes from './FioNameRenewContainer.module.scss';

const FioNameRenewContainer: React.FC<ContainerProps> = props => {
  const {
    currentWallet,
    feePrice,
    roe,
    history,
    name,
    fioDomains,
    fioNameType,
    refreshBalance,
    getFee,
  } = props;

  const { nativeFio: feeNativeFio, fio, usdc } = feePrice;
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<{
    name: string;
  } | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [error, setError] = useState<string>('');

  const { available: walletBalancesAvailable } = useWalletBalances(
    currentWallet.publicKey,
  );

  useEffect(() => {
    if (name && currentWallet && currentWallet.publicKey) {
      getFee(hasFioAddressDelimiter(name));
      refreshBalance(currentWallet.publicKey);
    }
  }, [name, currentWallet, refreshBalance, getFee]);

  useEffect(() => {
    fioNameType === DOMAIN &&
      setError(
        !fioDomains.find(({ name: fioDomainName }) => fioDomainName === name)
          ? `Fio Domain (${name}) is not available`
          : '',
      );
  }, [name, fioDomains, fioNameType]);

  const hasLowBalance =
    currentWallet &&
    feePrice &&
    new MathOp(walletBalancesAvailable.nativeFio || 0).lt(feeNativeFio || 0);

  const onSubmit = () => {
    setSubmitData({ name });
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

  if (error)
    return (
      <PseudoModalContainer
        title="Renew Now"
        link={MANAGE_PAGE_REDIRECT[fioNameType]}
      >
        <InfoBadge
          message={error}
          show={!!error}
          title="Error"
          type={BADGE_TYPES.ERROR}
        />
      </PseudoModalContainer>
    );

  if (!currentWallet || currentWallet.balance === null)
    return <FioLoader wrap={true} />;

  if (!currentWallet.publicKey && !processing)
    return <Redirect to={{ pathname: MANAGE_PAGE_REDIRECT[fioNameType] }} />;

  return (
    <>
      {currentWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <RenewEdgeWallet
          fioWallet={currentWallet}
          onSuccess={onSuccess}
          onCancel={onCancel}
          setProcessing={setProcessing}
          renewData={submitData}
          processing={processing}
          fee={feeNativeFio}
        />
      ) : null}
      <PseudoModalContainer
        title="Renew Now"
        link={MANAGE_PAGE_REDIRECT[fioNameType]}
      >
        <div className={classes.container}>
          <InfoBadge
            title="Renewal Information"
            message="This renewal will add 365 days to expiration"
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
          <PayWithBadge
            walletBalances={walletBalancesAvailable}
            walletName={currentWallet.name}
          />
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
