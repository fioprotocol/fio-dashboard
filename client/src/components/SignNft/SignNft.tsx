import React, { useEffect, useState } from 'react';
import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';

import apis from '../../api/index';
import PseudoModalContainer from '../PseudoModalContainer';
import SignNFTForm from './SignNftForm';
import { ContainerProps, NftFormValues } from './types';
import { PinConfirmation } from '../../types';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { waitForEdgeAccountStop } from '../../utils';
import Results from '../common/TransactionResults';
import { FIO_SIGN_NFT_REQUEST } from '../../redux/fio/actions';
import { ResultsData } from '../common/TransactionResults/types';
import Processing from '../common/TransactionProcessing';

const BUNDLE_COST = 2;

const SignNft: React.FC<ContainerProps> = props => {
  const {
    backTo,
    initialValues,
    singNFT,
    fioAddresses,
    fioWallets,
    fioAddressName,
    refreshBalance,
    pinConfirmation,
    showPinModal,
    resetPinConfirm,
    signNftProcessing,
    getFee,
    result,
  } = props;
  const [processing, setProcessing] = useState(false);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [alreadySigned, setAlreadySigned] = useState<boolean>(false);
  const [selectedFioAddressName, setSelectedFioAddress] = useState<string>(
    fioAddressName,
  );
  const fioAddress = fioAddresses.find(
    ({ name }) => name === selectedFioAddressName,
  );
  const checkNftSigned = async (chainCode: string, contractAddress: string) => {
    const { nfts } = await apis.fio.checkNftSigned(chainCode, contractAddress);
    setAlreadySigned(nfts.length > 0);
    return nfts.length > 0;
  };

  useEffect(() => {
    getFee(fioAddressName);
    if (
      initialValues != null &&
      initialValues.chain_code &&
      initialValues.contract_address
    ) {
      checkNftSigned(initialValues.chain_code, initialValues.contract_address);
    }
  }, []);

  useEffect(() => {
    if (fioAddress != null) refreshBalance(fioAddress.walletPublicKey);
  }, [fioAddress]);

  // Handle pin confirmation
  useEffect(() => {
    submit(pinConfirmation);
  }, [pinConfirmation]);

  // Handle results
  useEffect(() => {
    if (!signNftProcessing && processing) {
      resetPinConfirm();

      // TODO: set proper results
      setResultsData({
        name: fioAddressName,
        error: result.error,
      });
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
      const { data }: { data?: NftItem } = pinConfirmation;
      singNFT(fioAddressName, [{ ...data }], walletKeys[currentWallet.id]);
    }

    if (confirmationError) setProcessing(false);
  };

  const onSubmit = async (values: NftFormValues) => {
    const nftSigned = await checkNftSigned(
      values.chain_code,
      values.contract_address,
    );
    if (nftSigned) return {};
    showPinModal(CONFIRM_PIN_ACTIONS.SIGN_NFT, {
      chain_code: values.chain_code,
      contract_address: values.contract_address,
      token_id: values.token_id || '',
      url: values.url || '',
      hash: values.hash || '',
      metadata: { creator_url: values.creator_url || '' },
    });
    return {};
  };

  // TODO: show proper results
  if (resultsData)
    return (
      <Results
        results={resultsData}
        title={resultsData.error ? 'Failed!' : 'Signed!'}
        actionName={FIO_SIGN_NFT_REQUEST}
        onClose={() => {}}
        onRetry={() => {}}
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
  };
  return (
    <PseudoModalContainer
      title="Sign NFT"
      link={backTo || null}
      fullWidth={true}
    >
      <SignNFTForm {...formProps} />
      <Processing isProcessing={processing} />
    </PseudoModalContainer>
  );
};

export default SignNft;
