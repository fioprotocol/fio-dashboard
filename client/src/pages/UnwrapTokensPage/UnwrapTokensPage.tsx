import React, { useEffect, useState } from 'react';

import classNames from 'classnames';

import { ethers } from 'ethers';

import { useHistory } from 'react-router';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import UnwrapTokensForm from './components/UnwrapTokensForm/UnwrapTokensForm';
import UnWrapResults, {
  ResultsData,
} from '../../components/common/TransactionResults/components/UnWrapResults';
import PageTitle from '../../components/PageTitle/PageTitle';

import { useFioAddresses } from '../../util/hooks';
import useInitializeProviderConnection from '../../hooks/externalWalletsConnection/useInitializeProviderConnection';
import useGetWrappedFioData from '../../hooks/externalWalletsConnection/useGetWrappedFioData';
import { log } from '../../util/general';

import { ROUTES } from '../../constants/routes';
import { W_FIO_TOKEN } from '../../constants/ethereum';
import { CHAIN_CODES, ANALYTICS_EVENT_ACTIONS } from '../../constants/common';
import { LINKS } from '../../constants/labels';

import { DEFAULT_GAS_LIMIT } from '../../components/ConnectWallet/FeesModal/FeesModalInput';
import { fireAnalyticsEvent } from '../../util/analytics';

import { ContainerProps, InitialValues, UnWrapTokensValues } from './types';

import classes from './styles/UnwrapTokensPage.module.scss';

const initialValues: InitialValues = {
  fee: null,
};

const UnwrapTokensPage: React.FC<ContainerProps> = props => {
  const { fioWallet, loading, refreshWalletDataPublicKey, roe } = props;

  const history = useHistory();

  const [fioAddresses] = useFioAddresses(fioWallet && fioWallet.publicKey);

  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const [addressInPage, updateAddressInPage] = useState(null);

  const providerData = useInitializeProviderConnection();
  const { web3Provider, network } = providerData;
  const { wFioBalance, tokenContract, isWrongNetwork } = useGetWrappedFioData(
    web3Provider,
    network,
    addressInPage,
  );
  console.log('network', network);
  const [fioAddressesList, setFioAddressesList] = useState([]);
  const [modalInfoError, setModalInfoError] = useState(null);

  useEffect(() => {
    const cryptoHandles = fioAddresses?.length
      ? fioAddresses.map(o => o.name)
      : [];
    setFioAddressesList(cryptoHandles);
  }, [fioAddresses]);

  const onSubmit = async (data: UnWrapTokensValues) => {
    const { amount, fee, fioAddress, chainCode } = data;

    if (wFioBalance) {
      try {
        const signer = web3Provider.getSigner();

        const wFioWithSigner = tokenContract.connect(signer);

        const wFioAmount = ethers.utils.parseUnits(
          amount,
          W_FIO_TOKEN.decimals,
        );

        const transaction = await wFioWithSigner.unwrap(
          fioAddress,
          wFioAmount,
          {
            gasLimit: fee?.gasLimit || DEFAULT_GAS_LIMIT,
            gasPrice: fee?.gasPrice || undefined, //wei
          },
        );

        const results = {
          amount,
          chainCode,
          receivingAddress: fioAddress,
          publicAddress: transaction.from,
          other: {
            ...data,
            ...transaction,
            transaction_id: transaction.hash || transaction.transactionHash,
          },
        };

        setProcessing(false);
        setResultsData(results);
        fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.UNWRAP_TOKENS, results);

        if (fioWallet?.publicKey)
          refreshWalletDataPublicKey(fioWallet.publicKey);
      } catch (err) {
        if (err.code === 'ACTION_REJECTED') {
          setModalInfoError(
            'Transaction rejected in wallet. Please try again.',
          );
          return;
        }
        log.error('wrapped tokens transaction error', err);
        setModalInfoError(
          err.message ||
            'Something went wrong during submission. Please, check all data and try again.',
        );
      }
    } else {
      setModalInfoError(
        "This wallet account doesn't have wrapped FIO tokens or balance is low.",
      );
    }
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };

  const onBack = () => {
    const url = fioWallet?.publicKey
      ? `${ROUTES.FIO_WALLET}?publicKey=${fioWallet.publicKey}`
      : ROUTES.TOKENS;

    history.push(url);
  };

  if (resultsData)
    return (
      <>
        <PageTitle link={LINKS.UNWRAP_TOKENS_CONFIRMATION} isVirtualPage />
        <UnWrapResults
          isTokens
          results={resultsData}
          title={
            resultsData.error
              ? 'FIO Tokens not Unwrapped'
              : 'FIO Tokens Unwrapped'
          }
          roe={roe}
          onClose={onBack}
          onRetry={onResultsRetry}
        />
      </>
    );

  return (
    <>
      <PseudoModalContainer
        title="Unwrap FIO Tokens"
        onBack={onBack || null}
        middleWidth={true}
      >
        {fioWallet?.name ? (
          <p className={classes.subtitle}>
            <span className={classes.subtitleThin}>FIO Wallet Name:</span>{' '}
            {fioWallet.name}
          </p>
        ) : null}
        <p className={classes.subtitle}>
          <span className={classes.subtitleThin}>
            FIO Tokens will be unwrapped to the
          </span>{' '}
          {CHAIN_CODES.FIO} network
        </p>
        <p className={classes.subtitle}>
          <span className={classNames(classes.subtitleThin, classes.textSmall)}>
            Simply connect a wallet, select or manually input your FIO crypto
            handle, enter the wFIO amount ant complete your transaction to
            receive your unwrapped FIO tokens.
          </span>{' '}
        </p>

        <UnwrapTokensForm
          onSubmit={onSubmit}
          initialValues={initialValues}
          updateAddressInPage={updateAddressInPage}
          providerData={providerData}
          fioAddressesList={fioAddressesList}
          modalInfoError={modalInfoError}
          setModalInfoError={setModalInfoError}
          fioWallet={fioWallet}
          loading={loading || processing}
          fioAddresses={fioAddresses}
          wFioBalance={wFioBalance || '0'}
          network={network}
          isWrongNetwork={isWrongNetwork}
        />
      </PseudoModalContainer>
    </>
  );
};

export default UnwrapTokensPage;
