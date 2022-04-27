import React, { useState, useEffect } from 'react';

import FioLoader from '../../components/common/FioLoader/FioLoader';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import UnstakeTokensForm from './components/UnstakeTokensForm';
import UnstakeTokensEdgeWallet from './components/UnstakeTokensEdgeWallet';
import StakeTokensResults from '../../components/common/TransactionResults/components/StakeTokensResults';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import CancelButton from '../../components/common/CancelButton/CancelButton';

import { putParamsToUrl } from '../../utils';
import { convertFioPrices } from '../../util/prices';
import { useFioAddresses } from '../../util/hooks';

import { ROUTES } from '../../constants/routes';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { WALLET_CREATED_FROM } from '../../constants/common';

import { TrxResponsePaidBundles } from '../../api/fio';
import { ContainerProps, StakeTokensValues, InitialValues } from './types';
import { ResultsData } from '../../components/common/TransactionResults/types';

import classes from '../StakeTokensPage/styles/StakeTokensPage.module.scss';

const UnstakeTokensPage: React.FC<ContainerProps> = props => {
  const {
    fioWallet,
    balance,
    loading,
    feePrice,
    roe,
    history,
    refreshBalance,
    getFee,
    refreshWalletDataPublicKey,
  } = props;

  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [
    stakeTokensData,
    setStakeTokensData,
  ] = useState<StakeTokensValues | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const [walletFioAddresses, isWalletFioAddressesLoading] = useFioAddresses(
    fioWallet && fioWallet.publicKey,
  );

  useEffect(() => {
    getFee();
    setStakeTokensData(null);
  }, []);

  useEffect(() => {
    if (fioWallet && fioWallet.publicKey) refreshBalance(fioWallet.publicKey);
  }, [fioWallet]);

  const onStakeTokens = async (values: StakeTokensValues) => {
    setStakeTokensData({ ...values });
  };
  const onCancel = () => {
    setStakeTokensData(null);
    setProcessing(false);
  };
  const onSuccess = (res: TrxResponsePaidBundles) => {
    setStakeTokensData(null);
    setProcessing(false);
    setResultsData({
      feeCollected: convertFioPrices(res.fee_collected, roe),
      bundlesCollected: res.bundlesCollected,
      name: fioWallet.publicKey,
      publicKey: fioWallet.publicKey,
      other: {
        ...stakeTokensData,
        ...res,
      },
    });
    refreshWalletDataPublicKey(fioWallet.publicKey);
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };
  const onResultsClose = (isOpenLockedList: boolean) => {
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, { publicKey: fioWallet.publicKey }),
      {
        isOpenLockedList,
      },
    );
  };

  if (
    !fioWallet ||
    !fioWallet.id ||
    fioWallet.balance === null ||
    isWalletFioAddressesLoading
  )
    return <FioLoader wrap={true} />;

  const onBack = () =>
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, {
        publicKey: fioWallet.publicKey,
      }),
    );

  const initialValues: InitialValues = {
    publicKey: fioWallet.publicKey,
    fioAddress: walletFioAddresses[0]?.name,
  };

  if (resultsData)
    return (
      <StakeTokensResults
        results={resultsData}
        title={
          resultsData.error ? 'FIO Tokens not Unstaked' : 'FIO Tokens Unstaked'
        }
        labelAmount="Unstaking Information"
        titleAmount="Amount Unstaked"
        onClose={onResultsClose.bind(null, false)}
        onRetry={onResultsRetry}
        topElement={
          <InfoBadge
            show={true}
            type={BADGE_TYPES.INFO}
            title="Unstaking Reward Amount"
            message="The rewards amount of FIO Tokens will be locked for 7 days before it can be transferred or staked again"
          />
        }
        bottomElement={
          <CancelButton
            onClick={onResultsClose.bind(null, true)}
            isBlack={true}
            disabled={loading}
            withTopMargin={true}
            text="View Lock Status"
          />
        }
      />
    );

  return (
    <>
      {fioWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <UnstakeTokensEdgeWallet
          fioWallet={fioWallet}
          fee={feePrice.nativeFio}
          onCancel={onCancel}
          onSuccess={onSuccess}
          sendData={stakeTokensData}
          processing={processing}
          setProcessing={setProcessing}
        />
      ) : null}

      <PseudoModalContainer
        title="Unstake FIO Tokens"
        onBack={onBack || null}
        middleWidth={true}
      >
        <p className={classes.subtitle}>
          <span className={classes.subtitleThin}>FIO Wallet Name:</span>{' '}
          {fioWallet.name}
        </p>

        <UnstakeTokensForm
          balance={balance}
          loading={loading || processing}
          fioAddresses={walletFioAddresses}
          onSubmit={onStakeTokens}
          fee={feePrice}
          initialValues={initialValues}
        />
      </PseudoModalContainer>
    </>
  );
};

export default UnstakeTokensPage;
