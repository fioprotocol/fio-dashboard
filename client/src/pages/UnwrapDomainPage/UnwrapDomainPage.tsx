import React, { useEffect, useState } from 'react';

import classNames from 'classnames';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import UnwrapDomainForm from './components/UnwrapDomainForm';
import UnWrapResults, {
  ResultsData,
} from '../../components/common/TransactionResults/components/UnWrapResults';
import PageTitle from '../../components/PageTitle/PageTitle';

import { useFioAddresses } from '../../util/hooks';
import useInitializeProviderConnection from '../../hooks/externalWalletsConnection/useInitializeProviderConnection';
import useGetWrappedFioData from '../../hooks/externalWalletsConnection/useGetWrappedFioData';
import { log } from '../../util/general';

import { DEFAULT_GAS_LIMIT } from '../../components/ConnectWallet/FeesModal/FeesModalInput';
import { ROUTES } from '../../constants/routes';
import { LINKS } from '../../constants/labels';
import {
  ANALYTICS_EVENT_ACTIONS,
  CHAIN_CODES,
  DOMAIN_WRAP_NETWORKS_LIST,
} from '../../constants/common';

import { fireAnalyticsEvent } from '../../util/analytics';
import { ContainerProps, InitialValues, UnWrapDomainValues } from './types';

import classes from './styles/UnwrapDomainPage.module.scss';

const POLYGON_NETWORK_DATA = DOMAIN_WRAP_NETWORKS_LIST.find(
  o => o.chain_code === 'POL',
);

const initialValues: InitialValues = {
  chainCode: POLYGON_NETWORK_DATA.chain_code,
  fee: null,
};

const UnwrapTokensPage: React.FC<ContainerProps> = props => {
  const { loading, history, roe } = props;

  const [fioAddresses] = useFioAddresses();

  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const [addressInPage, updateAddressInPage] = useState(null);

  const providerData = useInitializeProviderConnection();
  const { web3Provider, network } = providerData;
  const {
    wFioBalance,
    tokenContract,
    nfts,
    isWrongNetwork,
  } = useGetWrappedFioData(web3Provider, network, addressInPage, true);

  const [fioAddressesList, setFioAddressesList] = useState([]);
  const [modalInfoError, setModalInfoError] = useState(null);

  useEffect(() => {
    const cryptoHandles = fioAddresses?.length
      ? fioAddresses.map(o => o.name)
      : [];
    setFioAddressesList(cryptoHandles);
  }, [fioAddresses]);

  const onSubmit = async (data: UnWrapDomainValues) => {
    const { fee, wrappedDomainTokenId, fioAddress, publicAddress } = data;
    let isWrappedDomainOwner = false;
    try {
      isWrappedDomainOwner =
        (await tokenContract.ownerOf(wrappedDomainTokenId)) === publicAddress;
    } catch (e) {
      log.error('wrapped domain check ownership fail', e);
    }

    if (wFioBalance && isWrappedDomainOwner) {
      try {
        const signer = web3Provider.getSigner();
        const wFioWithSigner = tokenContract.connect(signer);

        const transaction = await wFioWithSigner.unwrapnft(
          fioAddress,
          wrappedDomainTokenId,
          {
            gasLimit: fee?.gasLimit || DEFAULT_GAS_LIMIT,
            gasPrice: fee?.gasPrice || undefined, //wei
          },
        );

        const results = {
          chainCode: POLYGON_NETWORK_DATA.chain_code,
          receivingAddress: data.fioAddress,
          fioDomain: nfts?.length
            ? nfts.find(o => o.id === data.wrappedDomainTokenId)?.name
            : null,
          publicAddress: transaction.from,
          other: {
            ...data,
            ...transaction,
            transaction_id: transaction.hash || transaction.transactionHash,
          },
        };

        setProcessing(false);
        setResultsData(results);
        fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.UNWRAP_DOMAIN, results);

        // const receipt = await transaction.wait(); this will wait for transaction completion in chain
      } catch (err) {
        if (err.code === 'ACTION_REJECTED') {
          setModalInfoError(
            'Transaction rejected in wallet. Please try again.',
          );
          return;
        }
        log.error('wrapped domain transaction error', err);
        setModalInfoError(
          err.message ||
            'Something went wrong during submission. Please, check all data and try again.',
        );
      }
    } else {
      setModalInfoError(
        "This wallet account doesn't own selected wrapped FIO Domain or selected network is wrong.",
      );
    }
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };

  const onBack = () => {
    history.push(ROUTES.FIO_DOMAINS);
  };

  if (resultsData)
    return (
      <>
        <PageTitle link={LINKS.UNWRAP_DOMAIN_CONFIRMATION} isVirtualPage />
        <UnWrapResults
          results={resultsData}
          itemName="domain"
          title={
            resultsData.error
              ? 'FIO Domain not Unwrapped'
              : 'FIO Domain Unwrapped'
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
        title="Unwrap FIO Domain"
        onBack={onBack || null}
        middleWidth={true}
      >
        <p className={classes.subtitle}>
          <span className={classes.subtitleThin}>
            FIO domains are wrapped on the
          </span>{' '}
          {POLYGON_NETWORK_DATA.name} network
        </p>
        <p className={classes.subtitle}>
          <span className={classes.subtitleThin}>
            FIO domains will be unwrapped to the
          </span>{' '}
          {CHAIN_CODES.FIO} network
        </p>
        <p className={classes.subtitle}>
          <span className={classNames(classes.subtitleThin, classes.textSmall)}>
            Simply connect a wallet, select or manually input your FIO crypto
            handle, enter the FIO domain and complete your transaction to
            receive your unwrapped FIO domain.
          </span>{' '}
        </p>

        <UnwrapDomainForm
          loading={loading || processing}
          onSubmit={onSubmit}
          initialValues={initialValues}
          updateAddressInPage={updateAddressInPage}
          providerData={providerData}
          isWrongNetwork={isWrongNetwork}
          fioAddressesList={fioAddressesList}
          wrappedDomainsList={nfts}
          modalInfoError={modalInfoError}
          setModalInfoError={setModalInfoError}
          network={network}
        />
      </PseudoModalContainer>
    </>
  );
};

export default UnwrapTokensPage;
