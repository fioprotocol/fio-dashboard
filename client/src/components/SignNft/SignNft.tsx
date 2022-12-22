import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router';

import PseudoModalContainer from '../PseudoModalContainer';
import SignNFTForm from './components/SignNftForm/SignNftForm';
import SignResults from '../common/TransactionResults/components/SignResults';
import WalletAction from '../WalletAction/WalletAction';
import SignNftEdgeWallet from './components/SignNftEdgeWallet';
import SignNftLedgerWallet from './components/SignNftLedgerWallet';
import PageTitle from '../PageTitle/PageTitle';

import { ROUTES } from '../../constants/routes';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { BUNDLES_TX_COUNT } from '../../constants/fio';
import { LINKS } from '../../constants/labels';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import useEffectOnce from '../../hooks/general';

import apis from '../../api';

import { NFTTokenDoublet } from '../../types';
import { ContainerProps, NftFormValues } from './types';
import { ResultsData } from '../common/TransactionResults/types';

const SignNft: React.FC<ContainerProps> = props => {
  const {
    backTo,
    initialValues,
    fioWallets,
    fioAddressName,
    fioAddresses,
    loading,
    getFee,
    isEdit,
    addressSelectOff,
    refreshFioNames,
    getNFTSignatures,
    feePrice,
  } = props;

  const history = useHistory();

  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<NFTTokenDoublet | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [alreadySigned, setAlreadySigned] = useState<boolean>(false);
  const [selectedFioAddressName, setSelectedFioAddressName] = useState<string>(
    '',
  );

  const fioAddress =
    fioAddresses.find(({ name }) => name === fioAddressName) || fioAddresses[0];

  const currentWallet = fioWallets.find(
    ({ publicKey }) => publicKey === fioAddress?.walletPublicKey,
  );

  const checkNftSigned = useCallback(
    async (
      chainCode: string,
      contractAddress: string,
      tokenId: string = '',
    ) => {
      if (isEdit) return;
      const { nfts } = await apis.fio.checkNftSigned(
        chainCode,
        contractAddress,
        tokenId,
      );

      const currentFioAddressNfts = nfts.filter(
        ({ fio_address }) => fio_address === fioAddressName,
      );
      setAlreadySigned(currentFioAddressNfts.length > 0);
      return currentFioAddressNfts.length > 0;
    },
    [isEdit, fioAddressName],
  );

  const fieldValuesChanged = () => {
    if (alreadySigned) {
      setAlreadySigned(false);
    }
  };

  useEffectOnce(() => {
    if (
      initialValues != null &&
      initialValues.chainCode &&
      initialValues.contractAddress &&
      !isEdit
    ) {
      checkNftSigned(
        initialValues.chainCode,
        initialValues.contractAddress,
        initialValues.tokenId,
      );
    }
  }, [initialValues, isEdit, checkNftSigned]);

  useEffect(() => {
    if (selectedFioAddressName) {
      getFee(selectedFioAddressName);
    }
  }, [selectedFioAddressName, getFee]);

  useEffect(() => {
    if (fioAddress?.name) {
      setSelectedFioAddressName(fioAddress.name);
    }
  }, [fioAddress?.name]);

  useEffect(() => {
    if (fioWallets.length) {
      fioWallets.forEach(fioWallet => refreshFioNames(fioWallet.publicKey));
    }
  }, [fioWallets.length, refreshFioNames]);

  const onSubmit = async (values: NftFormValues) => {
    const nftSigned = await checkNftSigned(
      values.chainCode,
      values.contractAddress,
      values.tokenId,
    );
    if (nftSigned) return { tokenId: 'This Token ID has already been used.' };

    setSubmitData({
      fioAddress: fioAddress?.name,
      chainCode: values.chainCode,
      contractAddress: values.contractAddress,
      tokenId: values.tokenId || '',
      url: values.url || '',
      hash: values.hash || '',
      metadata: JSON.stringify({ creator_url: values.creatorUrl || '' }),
    });

    return {};
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };
  const onSuccess = async (result: {
    fee_collected: number;
    other: { nfts: NFTTokenDoublet[] };
  }) => {
    if (result != null) {
      const { metadata, ...rest } = result.other.nfts[0];
      const creatorUrl = (() => {
        try {
          return JSON.parse(metadata || '').creator_url;
        } catch (err) {
          return '';
        }
      })();

      setResultsData({
        name: fioAddress?.name,
        other: {
          creatorUrl,
          ...rest,
        },
      });

      fioAddress?.walletPublicKey &&
        refreshFioNames(fioAddress.walletPublicKey);
      fioAddress?.name && getNFTSignatures({ fioAddress: fioAddress.name });
    }
    setProcessing(false);
    setSubmitData(null);
  };

  const onResultsClose = () => {
    if (fioAddress?.name) {
      history.push({
        pathname: ROUTES.FIO_ADDRESS_SIGNATURES,
        search: `${QUERY_PARAMS_NAMES.ADDRESS}=${fioAddress?.name}`,
      });
    }
  };

  if (resultsData && !isEdit)
    return (
      <>
        <PageTitle link={LINKS.FIO_ADDRESS_SIGN_CONFIRMATION} isVirtualPage />
        <SignResults
          results={resultsData}
          title="Signed!"
          onClose={onResultsClose}
        />
      </>
    );

  const hasLowBalance =
    fioAddress != null ? fioAddress.remaining < BUNDLES_TX_COUNT.ADD_NFT : true;

  const formProps = {
    onSubmit,
    initialValues,
    fieldValuesChanged,
    alreadySigned,
    selectedFioAddressName,
    fioAddresses,
    setSelectedFioAddressName,
    bundleCost: BUNDLES_TX_COUNT.ADD_NFT,
    hasLowBalance,
    processing,
    fioAddress,
    isEdit,
    addressSelectOff,
    currentWallet,
    loading,
  };

  const title = isEdit ? 'Signed NFT' : 'Sign NFT';

  return (
    <>
      <WalletAction
        fioWallet={currentWallet}
        fee={feePrice.nativeFio}
        onCancel={onCancel}
        onSuccess={onSuccess}
        submitData={submitData}
        processing={processing}
        setProcessing={setProcessing}
        action={CONFIRM_PIN_ACTIONS.SIGN_NFT}
        FioActionWallet={SignNftEdgeWallet}
        LedgerActionWallet={SignNftLedgerWallet}
      />

      <PseudoModalContainer title={title} link={backTo} middleWidth={true}>
        <SignNFTForm {...formProps} />
      </PseudoModalContainer>
    </>
  );
};

export default SignNft;
