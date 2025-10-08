import React, { useState, useEffect, useCallback } from 'react';
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

import { VARS_KEYS } from '../../constants/vars';
import { HTTP_CODES } from '../../constants/network';

import { ContainerProps, StakeTokensValues, InitialValues } from './types';
import { TrxResponsePaidBundles } from '../../api/fio';
import { ResultsData } from '../../components/common/TransactionResults/types';
import { FioProxyItem } from '../../types/settings';

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
    siteSettings,
  } = props;

  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [
    stakeTokensData,
    setStakeTokensData,
  ] = useState<StakeTokensValues | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [proxyList, setProxyList] = useState<string[]>([]);
  const [proxyLoading, toggleProxyLoading] = useState<boolean>(true);

  const proxiesSettingValue = siteSettings[
    VARS_KEYS.FIO_PROXIES_LIST
  ] as FioProxyItem[];

  const isProxyStatusRecord = useCallback(
    (value: unknown): value is FioProxyItem => {
      if (typeof value !== 'object' || value === null) return false;
      const candidate = value as {
        proxy?: unknown;
        status?: unknown;
      };
      return (
        typeof candidate.proxy === 'string' &&
        typeof candidate.status === 'number'
      );
    },
    [],
  );

  const extractProxies = useCallback(
    (value: FioProxyItem[]): string[] => {
      if (Array.isArray(value)) {
        return value
          .map(item => {
            if (typeof item === 'string') return item;
            if (isProxyStatusRecord(item) && item.status === HTTP_CODES.SUCCESS)
              return item.proxy;
            return null;
          })
          .filter((proxy): proxy is string => Boolean(proxy));
      }

      return [];
    },
    [isProxyStatusRecord],
  );

  useEffect(() => {
    if (proxiesSettingValue === undefined) {
      return;
    }

    const extractedProxies = extractProxies(proxiesSettingValue);

    setProxyList(shuffle(extractedProxies));
    toggleProxyLoading(false);
  }, [extractProxies, proxiesSettingValue]);

  const [walletFioAddresses, isWalletFioAddressesLoading] = useFioAddresses(
    fioWallet && fioWallet.publicKey,
  );

  useEffect(() => {
    getFee();
    setStakeTokensData(null);
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
    if (res) {
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
    } else {
      setProcessing(false);
    }
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
