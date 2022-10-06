import React, { useState, useEffect } from 'react';
import shuffle from 'lodash/shuffle';

import FioLoader from '../../components/common/FioLoader/FioLoader';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import StakeTokensForm from './components/StakeTokensForm';
import StakeTokensEdgeWallet from './components/StakeTokensEdgeWallet';
import StakeTokensResults from '../../components/common/TransactionResults/components/StakeTokensResults';
import WalletAction from '../../components/WalletAction/WalletAction';
import LedgerWalletActionNotSupported from '../../components/LedgerWalletActionNotSupported';

import { ROUTES } from '../../constants/routes';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import { convertFioPrices } from '../../util/prices';
import { useFioAddresses } from '../../util/hooks';

import apis from '../../api';

import { ContainerProps, StakeTokensValues, InitialValues } from './types';
import { TrxResponsePaidBundles } from '../../api/fio';
import { ResultsData } from '../../components/common/TransactionResults/types';

import classes from './styles/StakeTokensPage.module.scss';

const StakeTokensPage: React.FC<ContainerProps> = props => {
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
  const [proxyList, setProxyList] = useState<string[]>([]);

  const [walletFioAddresses, isWalletFioAddressesLoading] = useFioAddresses(
    fioWallet && fioWallet.publicKey,
  );

  const getProxyList = async () => {
    const proxies = await apis.fio.getProxies();
    setProxyList(shuffle(proxies));
  };

  useEffect(() => {
    getFee();
    setStakeTokensData(null);
    getProxyList();
  }, []);

  useEffect(() => {
    if (!fioWallet?.publicKey) {
      history.push({
        pathname: ROUTES.TOKENS,
      });
    } else {
      refreshBalance(fioWallet.publicKey);
    }
  }, [fioWallet?.publicKey, history, refreshBalance]);

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
  const onResultsClose = () => {
    history.push({
      pathname: ROUTES.FIO_WALLET,
      search: `publicKey=${fioWallet.publicKey}`,
    });
  };

  if (
    !fioWallet ||
    !fioWallet.id ||
    fioWallet.balance === null ||
    isWalletFioAddressesLoading
  )
    return <FioLoader wrap={true} />;

  const onBack = () =>
    history.push({
      pathname: ROUTES.FIO_WALLET,
      search: `publicKey=${fioWallet.publicKey}`,
    });

  const initialValues: InitialValues = {
    publicKey: fioWallet.publicKey,
    fioAddress: walletFioAddresses[0]?.name,
    proxy: proxyList[0],
  };

  if (resultsData)
    return (
      <StakeTokensResults
        results={resultsData}
        title={
          resultsData.error ? 'FIO Tokens not Staked' : 'FIO Tokens Staked'
        }
        onClose={onResultsClose}
        onRetry={onResultsRetry}
      />
    );

  return (
    <>
      <WalletAction
        fioWallet={fioWallet}
        fee={feePrice.nativeFio}
        onCancel={onCancel}
        onSuccess={onSuccess}
        submitData={stakeTokensData}
        processing={processing}
        setProcessing={setProcessing}
        action={CONFIRM_PIN_ACTIONS.STAKE}
        FioActionWallet={StakeTokensEdgeWallet}
        LedgerActionWallet={LedgerWalletActionNotSupported}
      />

      <PseudoModalContainer
        title="Stake FIO Tokens"
        onBack={onBack || null}
        middleWidth={true}
      >
        <p className={classes.subtitle}>
          <span className={classes.subtitleThin}>FIO Wallet Name:</span>{' '}
          {fioWallet.name}
        </p>

        <StakeTokensForm
          balance={balance}
          loading={loading || processing}
          fioAddresses={walletFioAddresses}
          onSubmit={onStakeTokens}
          fee={feePrice}
          initialValues={initialValues}
          proxyList={proxyList}
        />
      </PseudoModalContainer>
    </>
  );
};

export default StakeTokensPage;
