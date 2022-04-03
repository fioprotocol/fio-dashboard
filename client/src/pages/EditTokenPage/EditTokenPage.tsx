import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

import ActionContainer from '../../components/LinkTokenList/ActionContainer';
import { CONTAINER_NAMES } from '../../components/LinkTokenList/constants';
import PublicAddressEdit from './components/PublicAddressEdit';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';

import { linkTokens } from '../../api/middleware/fio';
import { genericTokenId } from '../../util/fio';
import { minWaitTimeFunction } from '../../utils';
import { log } from '../../util/general';

import {
  ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION,
  TOKEN_LINK_MIN_WAIT_TIME,
} from '../../constants/fio';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import {
  LinkActionResult,
  PublicAddressDoublet,
  WalletKeys,
  FioAddressWithPubAddresses,
} from '../../types';

import classes from './styles/EditTokenPage.module.scss';

type Props = {
  fioCryptoHandle: FioAddressWithPubAddresses;
};

type EditTokenElement = {
  chainCode: string;
  tokenCode: string;
  isEditing: boolean;
  id: string;
  publicAddress: string;
  newPublicAddress: string;
};

const EditTokenPage: React.FC<Props> = props => {
  const {
    fioCryptoHandle: {
      publicAddresses,
      remaining,
      edgeWalletId,
      name: fioAddressName,
    },
  } = props;

  const [pubAddressesArr, changePubAddresses] = useState<EditTokenElement[]>(
    [],
  );
  const [bundleCost, changeBundleCost] = useState(0);
  const [resultsData, setResultsData] = useState<LinkActionResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<boolean | null>(null);

  const hasLowBalance = remaining - bundleCost < 0;
  const hasEdited = pubAddressesArr.some(
    pubAddress => pubAddress.newPublicAddress,
  );

  const pubAddressesToDefault = () => {
    publicAddresses &&
      changePubAddresses(
        publicAddresses.map(pubAddress => ({
          ...pubAddress,
          isEditing: false,
          newPublicAddress: '',
          id: genericTokenId(
            pubAddress.chainCode,
            pubAddress.tokenCode,
            pubAddress.publicAddress,
          ),
        })),
      );
  };

  useEffect(() => {
    pubAddressesToDefault();
  }, []);

  const handleEditTokenItem = (editedId: string, editedPubAddress: string) => {
    const currentAddress = pubAddressesArr.find(
      pubAddress => pubAddress.id === editedId,
    );
    if (!currentAddress) return;
    const { isEditing } = currentAddress;
    const updatePubAddressArr = () => {
      const updatedArr = pubAddressesArr.map(pubAddress =>
        pubAddress.id === editedId
          ? {
              ...pubAddress,
              newPublicAddress:
                editedPubAddress === pubAddress.publicAddress
                  ? ''
                  : editedPubAddress,
              isEditing: !isEditing,
            }
          : { ...pubAddress, isEditing: false },
      );
      const editedCount = updatedArr.filter(
        pubAddress => pubAddress.newPublicAddress || pubAddress.isEditing,
      ).length;

      changeBundleCost(
        Math.ceil(editedCount / ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION),
      );
      changePubAddresses(updatedArr);
    };
    updatePubAddressArr();
  };

  const onSuccess = () => {
    setProcessing(false);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const submit = async ({ keys }: { keys: WalletKeys }) => {
    const editedPubAddresses = pubAddressesArr.filter(
      pubAddress => pubAddress.newPublicAddress,
    );
    const params: {
      fioAddress: string;
      connectList: PublicAddressDoublet[];
      keys: WalletKeys;
    } = {
      fioAddress: fioAddressName,
      connectList: editedPubAddresses.map(pubAddress => ({
        ...pubAddress,
        publicAddress: pubAddress.newPublicAddress,
      })),
      keys,
    };
    try {
      const actionResults = await minWaitTimeFunction(
        () => linkTokens(params),
        TOKEN_LINK_MIN_WAIT_TIME,
      );
      setResultsData({
        ...actionResults,
        disconnect: {
          ...actionResults.disconnect,
          updated: editedPubAddresses,
        },
      });
    } catch (err) {
      log.error(err);
    } finally {
      setSubmitData(null);
    }
  };

  const onActionClick = () => {
    setSubmitData(true);
  };

  const onBack = () => {
    setResultsData(null);
    changeBundleCost(0);
    pubAddressesToDefault();
  };

  const onRetry = () => {
    setSubmitData(true);
  };

  return (
    <>
      <EdgeConfirmAction
        onSuccess={onSuccess}
        onCancel={onCancel}
        submitAction={submit}
        data={submitData}
        action={CONFIRM_PIN_ACTIONS.EDIT_TOKEN}
        processing={processing}
        setProcessing={setProcessing}
        fioWalletEdgeId={edgeWalletId}
      />
      <ActionContainer
        containerName={CONTAINER_NAMES.EDIT}
        fioCryptoHandle={props.fioCryptoHandle}
        bundleCost={bundleCost}
        onActionButtonClick={onActionClick}
        results={resultsData}
        changeBundleCost={changeBundleCost}
        onBack={onBack}
        onRetry={onRetry}
        isDisabled={!hasEdited || hasLowBalance || remaining === 0}
      >
        <div className={classes.container}>
          <h5 className={classnames(classes.subtitle, classes.hasMargin)}>
            Linked Tokens
          </h5>
        </div>
        {pubAddressesArr &&
          pubAddressesArr.map(pubAddress => (
            <PublicAddressEdit
              {...pubAddress}
              handleClick={handleEditTokenItem}
              hasLowBalance={hasLowBalance}
              key={pubAddress.id}
            />
          ))}
      </ActionContainer>
    </>
  );
};

export default EditTokenPage;
