import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router';

import PseudoModalContainer from '../PseudoModalContainer';
import SignNFTForm from './components/SignNftForm/SignNftForm';
import SignResults from '../common/TransactionResults/components/SignResults';
import EdgeConfirmAction from '../EdgeConfirmAction';
import LedgerWalletActionNotSupported from '../LedgerWalletActionNotSupported';
import PageTitle from '../PageTitle/PageTitle';
import { SignNftMetamaskWallet } from './components/SignNftMetamaskWallet';

import { ROUTES } from '../../constants/routes';
import {
  CONFIRM_PIN_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../constants/common';
import { BUNDLES_TX_COUNT } from '../../constants/fio';
import { LINKS } from '../../constants/labels';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import useEffectOnce from '../../hooks/general';
import { handleFioServerResponseActionData } from '../../util/fio';
import { camelizeObjKeys } from '../../utils';
import apis from '../../api';

import { FioAddressDoublet, NFTTokenDoublet } from '../../types';
import { ContainerProps, NftFormValues } from './types';
import { ResultsData } from '../common/TransactionResults/types';
import { SubmitActionParams } from '../EdgeConfirmAction/types';
import { NFT_ITEM } from '../../types/fio';
import { OnSuccessResponseResult } from '../MetamaskConfirmAction';

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
  } = props;

  const history = useHistory();

  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<NFTTokenDoublet | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [alreadySigned, setAlreadySigned] = useState<boolean>(false);
  const [
    selectedFioHandle,
    setSelectedFioHandle,
  ] = useState<FioAddressDoublet | null>(
    fioAddresses.find(({ name }) => name === fioAddressName) || fioAddresses[0],
  );
  const [selectedFioAddressName, setSelectedFioAddressName] = useState<string>(
    '',
  );

  const currentWallet = fioWallets.find(
    ({ publicKey }) => publicKey === selectedFioHandle?.walletPublicKey,
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

  const onFioHandleChange = useCallback(
    (fioHandle: string) => {
      setSelectedFioHandle(fioAddresses.find(({ name }) => name === fioHandle));
    },
    [fioAddresses],
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
    if (selectedFioHandle) {
      setSelectedFioAddressName(selectedFioHandle.name);
    }
  }, [selectedFioHandle]);

  useEffect(() => {
    if (fioWallets.length) {
      fioWallets.forEach(fioWallet => refreshFioNames(fioWallet.publicKey));
    }
  }, [fioWallets, fioWallets.length, refreshFioNames]);

  const submit = async ({ keys, data }: SubmitActionParams) => {
    return await apis.fio.singNFT(keys, selectedFioHandle?.name || '', [
      { ...data },
    ]);
  };

  const onSubmit = async (values: NftFormValues) => {
    const nftSigned = await checkNftSigned(
      values.chainCode,
      values.contractAddress,
      values.tokenId,
    );
    if (nftSigned) return { tokenId: 'This Token ID has already been used.' };

    setSubmitData({
      fioAddress: selectedFioHandle?.name,
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
  const onSuccess = async (
    result:
      | {
          fee_collected: number;
          other: { nfts: NFTTokenDoublet[] };
        }
      | OnSuccessResponseResult,
  ) => {
    if (result != null) {
      let nfts: NFTTokenDoublet | NFT_ITEM;

      if ('fee_collected' in result) {
        nfts = result.other?.nfts[0];
      } else {
        if (!Array.isArray(result) && 'transaction_id' in result) {
          nfts = handleFioServerResponseActionData(result)?.nfts[0];
        }
      }

      const { metadata, ...rest } = nfts;
      const creatorUrl = (() => {
        try {
          return JSON.parse(metadata || '').creator_url;
        } catch (err) {
          return '';
        }
      })();

      setResultsData({
        name: selectedFioHandle?.name,
        other: {
          creatorUrl,
          ...camelizeObjKeys(rest),
        },
      });

      selectedFioHandle?.walletPublicKey &&
        refreshFioNames(selectedFioHandle.walletPublicKey);
      selectedFioHandle?.name &&
        getNFTSignatures({ fioAddress: selectedFioHandle.name });
    }
    setProcessing(false);
    setSubmitData(null);
  };

  const onResultsClose = () => {
    if (selectedFioHandle?.name) {
      history.push({
        pathname: ROUTES.FIO_ADDRESS_SIGNATURES,
        search: `${QUERY_PARAMS_NAMES.ADDRESS}=${selectedFioHandle?.name}`,
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
    selectedFioHandle != null
      ? selectedFioHandle.remaining < BUNDLES_TX_COUNT.ADD_NFT
      : true;

  const formProps = {
    onSubmit,
    initialValues,
    fieldValuesChanged,
    alreadySigned,
    selectedFioAddressName,
    fioAddresses,
    onFioHandleChange,
    bundleCost: BUNDLES_TX_COUNT.ADD_NFT,
    hasLowBalance,
    processing,
    fioAddress: selectedFioHandle,
    isEdit,
    addressSelectOff,
    currentWallet,
    loading,
  };

  const title = isEdit ? 'Signed NFT' : 'Sign NFT';

  return (
    <>
      {currentWallet?.from === WALLET_CREATED_FROM.EDGE ? (
        <EdgeConfirmAction
          action={CONFIRM_PIN_ACTIONS.SIGN_NFT}
          setProcessing={setProcessing}
          onSuccess={onSuccess}
          onCancel={onCancel}
          processing={processing}
          data={submitData}
          submitAction={submit}
          fioWalletEdgeId={currentWallet?.edgeId || ''}
          edgeAccountLogoutBefore={true}
        />
      ) : null}

      {currentWallet?.from === WALLET_CREATED_FROM.LEDGER ? (
        <LedgerWalletActionNotSupported
          submitData={submitData}
          onCancel={onCancel}
        />
      ) : null}

      {currentWallet?.from === WALLET_CREATED_FROM.METAMASK ? (
        <SignNftMetamaskWallet
          derivationIndex={currentWallet?.data?.derivationIndex}
          processing={processing}
          submitData={submitData}
          startProcessing={!!submitData}
          onSuccess={onSuccess}
          onCancel={onCancel}
          setProcessing={setProcessing}
        />
      ) : null}

      <PseudoModalContainer title={title} link={backTo} middleWidth={true}>
        <SignNFTForm {...formProps} />
      </PseudoModalContainer>
    </>
  );
};

export default SignNft;
