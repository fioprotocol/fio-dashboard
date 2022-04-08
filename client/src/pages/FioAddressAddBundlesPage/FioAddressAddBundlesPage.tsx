import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import PriceBadge from '../../components/Badges/PriceBadge/PriceBadge';
import PayWithBadge from '../../components/Badges/PayWithBadge/PayWithBadge';
import LowBalanceBadge from '../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import AddBundlesEdgeWallet from './components/AddBundlesEdgeWallet';
import Results from '../../components/common/TransactionResults';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import FioNamesInitWrapper from '../../components/FioNamesInitWrapper';
import Badge, { BADGE_TYPES } from '../../components/Badge/Badge';

import { convertFioPrices } from '../../util/prices';
import { useFioWallet, useWalletBalances } from '../../util/hooks';
import MathOp from '../../util/math';

import { WALLET_CREATED_FROM } from '../../constants/common';
import { ERROR_TYPES } from '../../components/common/TransactionResults/constants';
import { ROUTES } from '../../constants/routes';

import { ResultsData } from '../../components/common/TransactionResults/types';
import { AddBundlesValues, ContainerProps } from './types';

import classes from '../../components/FioNameRenew/FioNameRenewContainer.module.scss';

type MatchParams = {
  id: string;
};
type LocationState = {
  backUrl?: string;
};

const DEFAULT_BUNDLE_SET_VALUE = 1;
const DEFAULT_BUNDLE_AMOUNT = 100;

const FioAddressAddBundlesPage: React.FC<ContainerProps &
  RouteComponentProps<MatchParams, {}, LocationState>> = props => {
  const {
    fioAddresses,
    feePrice,
    roe,
    history,
    getFee,
    match,
    location,
  } = props;
  const { id: name } = match.params;
  const { state: { backUrl = ROUTES.FIO_ADDRESSES } = {} } = location;

  const { currentWallet, settingWallet } = useFioWallet(fioAddresses, name);
  const { nativeFio: feeNativeFio, fio, usdc } = feePrice;
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<AddBundlesValues | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    getFee();
  }, [getFee]);

  useEffect(() => {
    setError(
      !fioAddresses.find(
        ({ name: fioCryptoHandleName }) => fioCryptoHandleName === name,
      )
        ? `Fio Crypto Handle (${name}) is not available`
        : '',
    );
  }, [name, fioAddresses]);

  const { available: walletBalancesAvailable } = useWalletBalances(
    currentWallet.publicKey,
  );

  const hasLowBalance =
    feePrice &&
    new MathOp(walletBalancesAvailable.nativeFio || 0).lt(feeNativeFio || 0);

  const onSubmit = () => {
    setSubmitData({
      fioAddress: name,
      bundleSets: DEFAULT_BUNDLE_SET_VALUE,
      maxFee: feeNativeFio,
    });
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
    history.goBack();
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };

  const renderDetails = () => {
    return (
      <Badge type={BADGE_TYPES.WHITE} show={true}>
        <div className="d-sm-flex justify-content-between align-items-center w-100">
          <div className={classes.detailsName}>{name}</div>
          <div className={classes.detailsValue}>
            {DEFAULT_BUNDLE_AMOUNT} bundled transactions
          </div>
        </div>
      </Badge>
    );
  };

  if (resultsData)
    return (
      <Results
        results={resultsData}
        title={
          resultsData.error
            ? 'Adding Bundled Transactions Failed!'
            : 'Bundled Transactions Added!'
        }
        onClose={onResultsClose}
        onRetry={onResultsRetry}
        errorType={ERROR_TYPES.ADD_BUNDLES_ERROR}
      >
        <h5 className={classes.label}>Add Bundled Transactions Details</h5>
        {renderDetails()}
      </Results>
    );

  if (error)
    return (
      <PseudoModalContainer title="Add bundled transactions" link={backUrl}>
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

  if (
    (!currentWallet.publicKey && !settingWallet && !processing) ||
    fioAddresses.length < 1
  )
    return <Redirect to={{ pathname: ROUTES.FIO_ADDRESSES }} />;

  return (
    <>
      {currentWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <AddBundlesEdgeWallet
          fioWallet={currentWallet}
          onSuccess={onSuccess}
          onCancel={onCancel}
          setProcessing={setProcessing}
          sendData={submitData}
          processing={processing}
        />
      ) : null}

      <PseudoModalContainer title="Add bundled transactions" link={backUrl}>
        <div className={classes.container}>
          <h5 className={classes.label}>Add Bundled Transactions Details</h5>
          {renderDetails()}
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
            text="Add Bundled Transactions"
            disabled={hasLowBalance || processing}
            loading={processing || settingWallet}
            withTopMargin={true}
          />
        </div>
      </PseudoModalContainer>
    </>
  );
};

const FioAddressAddBundlesPageWrapper: React.FC<ContainerProps &
  RouteComponentProps<MatchParams, {}, LocationState>> = props => {
  return (
    <FioNamesInitWrapper>
      <FioAddressAddBundlesPage {...props} />
    </FioNamesInitWrapper>
  );
};

export default FioAddressAddBundlesPageWrapper;
