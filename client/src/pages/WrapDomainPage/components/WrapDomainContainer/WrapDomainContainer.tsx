import React, { useState } from 'react';
import classNames from 'classnames';

import FioLoader from '../../../../components/common/FioLoader/FioLoader';
import PseudoModalContainer from '../../../../components/PseudoModalContainer';
import WrapDomainForm from '../WarapDomainForm';
import WrapDomainEdgeWallet from '../WrapDomainEdgeWallet';
import WrapTokenResults from '../../../../components/common/TransactionResults/components/WrapTokenResults';

import { useFioAddresses, useWalletBalances } from '../../../../util/hooks';
import useEffectOnce from '../../../../hooks/general';
import MathOp from '../../../../util/math';

import { ROUTES } from '../../../../constants/routes';
import { WALLET_CREATED_FROM } from '../../../../constants/common';

import { TrxResponsePaidBundles } from '../../../../api/fio';
import {
  ContainerProps,
  InitialValues,
  ResultsData,
  WrapDomainValues,
} from '../../types';

import classes from '../../styles/WrapDomainPage.module.scss';

const NETWORK_TYPES = [
  {
    name: 'Polygon Network',
    chain_code: 'POLY',
  },
];

const WrapDomainContainer: React.FC<ContainerProps> = props => {
  const {
    currentWallet,
    name: domainName,
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
  const [sendData, setSendData] = useState<WrapDomainValues | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const [walletFioAddresses] = useFioAddresses(currentWallet?.publicKey);

  const balance = useWalletBalances(currentWallet?.publicKey);

  useEffectOnce(() => {
    getFee();
    getOracleFees();
    setSendData(null);
  }, [getFee, getOracleFees, setSendData]);

  useEffectOnce(
    () => {
      refreshBalance(currentWallet.publicKey);
    },
    [refreshBalance, currentWallet],
    !!currentWallet?.publicKey && !!refreshBalance,
  );

  const onSend = async (values: WrapDomainValues) => {
    setSendData({ ...values });
  };
  const onCancel = () => {
    setSendData(null);
    setProcessing(false);
  };
  const onSuccess = (res: TrxResponsePaidBundles) => {
    setSendData(null);
    setProcessing(false);
    setResultsData({
      name: sendData.name,
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
    refreshWalletDataPublicKey(currentWallet.publicKey);
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };
  const onResultsClose = () => {
    history.push(ROUTES.FIO_DOMAINS);
  };

  if (!currentWallet || !currentWallet.id) return <FioLoader wrap={true} />;

  const onBack = () => history.push(ROUTES.FIO_DOMAINS);

  const initialValues: InitialValues = {
    tpid: walletFioAddresses[0]?.name,
    chainCode: NETWORK_TYPES[0].chain_code,
    name: domainName,
  };

  if (resultsData)
    return (
      <WrapTokenResults
        results={resultsData}
        title={
          resultsData.error ? 'FIO Domain not Wrapped' : 'FIO Domain Wrapped'
        }
        roe={roe}
        onClose={onResultsClose}
        onRetry={onResultsRetry}
      />
    );

  return (
    <>
      {currentWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <WrapDomainEdgeWallet
          fioWallet={currentWallet}
          fee={feePrice.nativeFio}
          oracleFee={oracleFeePrice?.nativeFio}
          onCancel={onCancel}
          onSuccess={onSuccess}
          wrapData={sendData}
          processing={processing}
          setProcessing={setProcessing}
        />
      ) : null}

      <PseudoModalContainer
        title="Wrap FIO Domain"
        onBack={onBack || null}
        middleWidth={true}
      >
        <p className={classes.subtitle}>
          <span className={classes.subtitleThin}>FIO Domain Name:</span>{' '}
          {domainName}
        </p>
        <p className={classes.subtitle}>
          <span className={classes.subtitleThin}>
            FIO domains are wrapped on the
          </span>{' '}
          {NETWORK_TYPES[0].name}
        </p>
        <p className={classes.subtitle}>
          <span className={classNames(classes.subtitleThin, classes.textSmall)}>
            Simply paste your public address or connect a wallet, enter the
            amount of FIO and complete your transaction to receive your wrapped
            FIO domain
          </span>{' '}
        </p>

        <WrapDomainForm
          fioWallet={currentWallet}
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

export default WrapDomainContainer;
