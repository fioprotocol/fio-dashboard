import React, { useState } from 'react';

import classNames from 'classnames';

import FioLoader from '../../components/common/FioLoader/FioLoader';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import WrapTokensForm from './components/WrapTokensForm';
import WrapTokensEdgeWallet from './components/WrapTokensEdgeWallet';
import WrapTokenResults from '../../components/common/TransactionResults/components/WrapTokenResults';
import PageTitle from '../../components/PageTitle/PageTitle';

import { useFioAddresses, useWalletBalances } from '../../util/hooks';
import useEffectOnce from '../../hooks/general';
import MathOp from '../../util/math';

import { ROUTES } from '../../constants/routes';
import {
  ANALYTICS_EVENT_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../constants/common';
import { LINKS } from '../../constants/labels';

import { fireAnalyticsEvent } from '../../util/analytics';

import { TrxResponsePaidBundles } from '../../api/fio';
import {
  ContainerProps,
  InitialValues,
  ResultsData,
  WrapTokensValues,
} from './types';

import classes from './styles/WrapTokensPage.module.scss';

const NETWORK_TYPES = [
  {
    name: 'Ethereum Network',
    id: 'ETH',
  },
];

const WrapTokensPage: React.FC<ContainerProps> = props => {
  const {
    fioWallet,
    loading,
    feePrice,
    oracleFeePrice,
    roe,
    history,
    refreshBalance,
    getFee,
    getOracleFees,
    refreshWalletDataPublicKey,
  } = props;

  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [sendData, setSendData] = useState<WrapTokensValues | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const [walletFioAddresses] = useFioAddresses(
    fioWallet && fioWallet.publicKey,
  );

  const balance = useWalletBalances(fioWallet?.publicKey);

  useEffectOnce(() => {
    getFee();
    getOracleFees();
    setSendData(null);
  }, [getFee, getOracleFees, setSendData]);

  useEffectOnce(
    () => {
      refreshBalance(fioWallet.publicKey);
    },
    [refreshBalance, fioWallet],
    !!fioWallet?.publicKey && !!refreshBalance,
  );

  const onSend = async (values: WrapTokensValues) => {
    setSendData({ ...values });
    fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.WRAP_TOKENS, values);
  };
  const onCancel = () => {
    setSendData(null);
    setProcessing(false);
  };
  const onSuccess = (res: TrxResponsePaidBundles) => {
    setSendData(null);
    setProcessing(false);
    setResultsData({
      amount: sendData.amount,
      chainCode: sendData.chainCode,
      publicAddress: sendData.publicAddress,
      feeCollectedAmount: new MathOp(oracleFeePrice.fio)
        .add(feePrice.fio)
        .toNumber(),
      nativeFeeCollectedAmount: new MathOp(res.oracle_fee_collected)
        .add(res.fee_collected)
        .toNumber(),
      other: {
        ...sendData,
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

  if (!fioWallet || !fioWallet.id) return <FioLoader wrap={true} />;

  const onBack = () =>
    history.push({
      pathname: ROUTES.FIO_WALLET,
      search: `publicKey=${fioWallet.publicKey}`,
    });

  const initialValues: InitialValues = {
    tpid: walletFioAddresses[0]?.name,
    chainCode: NETWORK_TYPES[0].id,
  };

  if (resultsData)
    return (
      <>
        <PageTitle link={LINKS.WRAP_TOKENS_CONFIRMATION} isVirtualPage />
        <WrapTokenResults
          results={resultsData}
          title={
            resultsData.error ? 'FIO Tokens not Wrapped' : 'FIO Tokens Wrapped'
          }
          roe={roe}
          onClose={onResultsClose}
          onRetry={onResultsRetry}
        />
      </>
    );

  return (
    <>
      {fioWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <WrapTokensEdgeWallet
          fioWallet={fioWallet}
          fee={feePrice.nativeFio}
          oracleFee={oracleFeePrice.nativeFio}
          onCancel={onCancel}
          onSuccess={onSuccess}
          wrapData={sendData}
          processing={processing}
          setProcessing={setProcessing}
        />
      ) : null}

      <PseudoModalContainer
        title="Wrap FIO Tokens"
        onBack={onBack || null}
        middleWidth={true}
      >
        <p className={classes.subtitle}>
          <span className={classes.subtitleThin}>FIO Wallet Name:</span>{' '}
          {fioWallet.name}
        </p>
        <p className={classes.subtitle}>
          <span className={classes.subtitleThin}>
            FIO Tokens are wrapped on the
          </span>{' '}
          {NETWORK_TYPES[0].name}
        </p>
        <p className={classes.subtitle}>
          <span className={classNames(classes.subtitleThin, classes.textSmall)}>
            Simply paste your public address or connect a wallet, enter the
            amount of FIO and complete your transaction to receive your wrapped
            FIO tokens
          </span>{' '}
        </p>

        <WrapTokensForm
          fioWallet={fioWallet}
          balance={balance}
          loading={loading || processing}
          fioAddresses={walletFioAddresses}
          onSubmit={onSend}
          fee={feePrice}
          oracleFee={oracleFeePrice}
          roe={roe}
          initialValues={initialValues}
        />
      </PseudoModalContainer>
    </>
  );
};

export default WrapTokensPage;
