import React, { useState, useEffect } from 'react';
import shuffle from 'lodash/shuffle';

import FioLoader from '../../components/common/FioLoader/FioLoader';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import StakeTokensForm from './components/StakeTokensForm';
import StakeTokensEdgeWallet from './components/StakeTokensEdgeWallet';
import StakeTokensLedgerWallet from './components/StakeTokensLedgerWallet';
import StakeTokensResults from '../../components/common/TransactionResults/components/StakeTokensResults';
import WalletAction from '../../components/WalletAction/WalletAction';
import { StakeTokensMetamaskWallet } from './components/StakeTokensMetamaskWallet';

import { ROUTES } from '../../constants/routes';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { convertFioPrices } from '../../util/prices';
import { useFioAddresses } from '../../util/hooks';
import { log } from '../../util/general';

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
  const [proxyLoading, toggleProxyLoading] = useState<boolean>(false);

  const [walletFioAddresses, isWalletFioAddressesLoading] = useFioAddresses(
    fioWallet && fioWallet.publicKey,
  );

  const getProxyList = async () => {
    try {
      toggleProxyLoading(true);
      const proxies = await apis.fio.getProxies();
      setProxyList(shuffle(proxies));
    } catch (error) {
      log.error(error);
    } finally {
      toggleProxyLoading(false);
    }
  };

  useEffect(() => {
    getFee();
    setStakeTokensData(null);
    getProxyList();
  }, [getFee]);

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
      feeCollected: convertFioPrices(res?.fee_collected, roe),
      bundlesCollected: res?.bundlesCollected,
      name: fioWallet.publicKey,
      publicKey: fioWallet.publicKey,
      other: {
        ...stakeTokensData,
        ...res,
      },
      payWith: {
        walletName: fioWallet.name,
        walletBalances: balance.available,
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
      search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}`,
    });
  };

  if (!fioWallet || !fioWallet.id || fioWallet.balance === null)
    return <FioLoader wrap={true} />;

  const onBack = () =>
    history.push({
      pathname: ROUTES.FIO_WALLET,
      search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}`,
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
        MetamaskActionWallet={StakeTokensMetamaskWallet}
        LedgerActionWallet={StakeTokensLedgerWallet}
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
          fioWallet={fioWallet}
          balance={balance}
          isWalletFioAddressesLoading={isWalletFioAddressesLoading}
          loading={loading || processing}
          fioAddresses={walletFioAddresses}
          onSubmit={onStakeTokens}
          fee={feePrice}
          initialValues={initialValues}
          proxyList={proxyList}
          proxyLoading={proxyLoading}
        />
      </PseudoModalContainer>
    </>
  );
};

export default StakeTokensPage;
