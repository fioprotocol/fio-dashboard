import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import apis from '../../api/index';
import PseudoModalContainer from '../PseudoModalContainer';
import SignNFTForm from './SignNftForm';
import { ContainerProps, NftFormValues } from './types';
import { PinConfirmation } from '../../types';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { putParamsToUrl, waitForEdgeAccountStop } from '../../utils';
import Results from '../common/TransactionResults';
import { FIO_SIGN_NFT_REQUEST } from '../../redux/fio/actions';
import { ResultsData } from '../common/TransactionResults/types';
import Processing from '../common/TransactionProcessing';
import { ROUTES } from '../../constants/routes';

import { NFTTokenDoublet } from '../../types';

const BUNDLE_COST = 2;

const SignNft: React.FC<ContainerProps> = props => {
  const {
    backTo,
    initialValues,
    singNFT,
    fioAddresses,
    fioWallets,
    fioAddressName,
    pinConfirmation,
    showPinModal,
    resetPinConfirm,
    signNftProcessing,
    getFee,
    result,
    isEdit,
    refreshFioNames,
    getNFTSignatures,
  } = props;
  const history = useHistory();
  const [processing, setProcessing] = useState(false);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [alreadySigned, setAlreadySigned] = useState<boolean>(false);
  const [selectedFioAddressName, setSelectedFioAddress] = useState<string>(
    fioAddressName,
  );
  const fioAddress = fioAddresses.find(
    ({ name }) => name === selectedFioAddressName,
  );
  const checkNftSigned = async (
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
    setAlreadySigned(nfts.length > 0);
    return nfts.length > 0;
  };

  useEffect(() => {
    getFee(fioAddressName);
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
  }, []);

  // Handle pin confirmation
  useEffect(() => {
    submit(pinConfirmation);
  }, [pinConfirmation]);

  // Handle results
  useEffect(() => {
    if (!signNftProcessing && processing) {
      resetPinConfirm();

      if (result != null && !result.error) {
        const { metadata, ...rest } = result.other.nfts[0];
        const creatorUrl = (() => {
          try {
            return JSON.parse(metadata).creator_url;
          } catch (err) {
            return '';
          }
        })();

        setResultsData({
          name: fioAddress.name,
          other: {
            creatorUrl,
            ...rest,
          },
        });

        refreshFioNames(fioAddress.walletPublicKey);
        getNFTSignatures({ fioAddress: fioAddress.name });
      }
      setProcessing(false);
    }
  }, [signNftProcessing, result]);

  const fieldValuesChanged = () => {
    if (alreadySigned) {
      setAlreadySigned(false);
    }
  };

  const submit = async (pinConfirmation: PinConfirmation) => {
    const {
      account: edgeAccount,
      keys: walletKeys,
      error: confirmationError,
      action: confirmationAction,
    } = pinConfirmation;

    if (confirmationAction !== CONFIRM_PIN_ACTIONS.SIGN_NFT) return;
    const currentWallet = fioWallets.find(
      ({ publicKey }) => publicKey === fioAddress.walletPublicKey,
    );
    if (
      walletKeys &&
      walletKeys[currentWallet.id] &&
      !confirmationError &&
      !signNftProcessing &&
      !processing
    ) {
      setProcessing(true);
      await waitForEdgeAccountStop(edgeAccount);
      const { data }: { data?: NFTTokenDoublet } = pinConfirmation;
      singNFT(fioAddress.name, [{ ...data }], walletKeys[currentWallet.id]);
    }

    if (confirmationError) setProcessing(false);
  };

  const onSubmit = async (values: NftFormValues) => {
    const nftSigned = await checkNftSigned(
      values.chainCode,
      values.contractAddress,
      values.tokenId,
    );
    if (nftSigned) return {};
    showPinModal(CONFIRM_PIN_ACTIONS.SIGN_NFT, {
      chainCode: values.chainCode,
      contractAddress: values.contractAddress,
      tokenId: values.tokenId || '',
      url: values.url || '',
      hash: values.hash || '',
      metadata: JSON.stringify({ creator_url: values.creatorUrl || '' }),
    });
    return {};
  };

  const onResultsClose = () => {
    history.push(
      putParamsToUrl(ROUTES.FIO_ADDRESS_SIGNATURES, {
        address: fioAddress.name,
      }),
    );
  };

  if (resultsData && !isEdit)
    return (
      <Results
        results={resultsData}
        title="Signed!"
        actionName={FIO_SIGN_NFT_REQUEST}
        onClose={onResultsClose}
      />
    );

  const hasLowBalance =
    fioAddress != null ? fioAddress.remaining < BUNDLE_COST : true;

  const formProps = {
    onSubmit,
    initialValues,
    fieldValuesChanged,
    alreadySigned,
    selectedFioAddressName,
    fioAddresses,
    setSelectedFioAddress,
    bundleCost: BUNDLE_COST,
    hasLowBalance,
    processing,
    fioAddress,
    isEdit,
  };

  const title = isEdit ? 'Signed NFT' : 'Sign NFT';

  return (
    <PseudoModalContainer
      title={title}
      link={backTo || null}
      middleWidth={true}
    >
      <SignNFTForm {...formProps} />
      <Processing isProcessing={processing} />
    </PseudoModalContainer>
  );
};

export default SignNft;
