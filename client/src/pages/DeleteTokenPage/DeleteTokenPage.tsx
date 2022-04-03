import React, { useEffect, useState } from 'react';

import ActionContainer from '../../components/LinkTokenList/ActionContainer';
import { CONTAINER_NAMES } from '../../components/LinkTokenList/constants';
import CheckedDropdown from './components/CheckedDropdown';
import DeleteTokenItem from './components/DeleteTokenItem';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';

import { linkTokens } from '../../api/middleware/fio';
import { genericTokenId } from '../../util/fio';
import { minWaitTimeFunction } from '../../utils';
import { log } from '../../util/general';

import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import {
  TOKEN_LINK_MIN_WAIT_TIME,
  BUNDLES_TX_COUNT,
} from '../../constants/fio';

import { CheckedTokenType } from './types';
import {
  WalletKeys,
  PublicAddressDoublet,
  LinkActionResult,
  FioAddressWithPubAddresses,
} from '../../types';

import classes from './styles/DeleteToken.module.scss';

type Props = {
  fioCryptoHandle: FioAddressWithPubAddresses;
  loading: boolean;
};

const DeleteTokenPage: React.FC<Props> = props => {
  const { fioCryptoHandle, loading } = props;
  const {
    remaining = 0,
    edgeWalletId = '',
    publicAddresses = [],
  } = fioCryptoHandle;

  const [pubAddressesArr, changePubAddresses] = useState<CheckedTokenType[]>(
    [],
  );
  const [bundleCost, changeBundleCost] = useState(0);
  const [allChecked, toggleAllChecked] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<boolean | null>(null);
  const [resultsData, setResultsData] = useState<LinkActionResult | null>(null);

  const hasLowBalance = remaining - bundleCost < 0 || remaining === 0;

  const hasChecked = pubAddressesArr.some(pubAddress => pubAddress.isChecked);

  const pubAddressesToDefault = () =>
    publicAddresses &&
    changePubAddresses(
      publicAddresses.map(pubAddress => ({
        ...pubAddress,
        isChecked: false,
        id: genericTokenId(
          pubAddress.chainCode,
          pubAddress.tokenCode,
          pubAddress.publicAddress,
        ),
      })),
    );

  useEffect(() => {
    pubAddressesToDefault();
  }, []);

  useEffect(() => {
    hasChecked
      ? changeBundleCost(BUNDLES_TX_COUNT.REMOVE_PUBLIC_ADDRESS)
      : changeBundleCost(0);
  }, [hasChecked]);

  useEffect(() => {
    toggleAllChecked(pubAddressesArr.every(pubAddress => pubAddress.isChecked));
  }, [JSON.stringify(pubAddressesArr)]);

  const onCheckClick = (checkedId: string) => {
    changePubAddresses(
      pubAddressesArr.map(pubAddress =>
        pubAddress.id === checkedId
          ? {
              ...pubAddress,
              isChecked: !pubAddress.isChecked,
            }
          : pubAddress,
      ),
    );
  };

  const allCheckedChange = (isChecked: boolean) => {
    toggleAllChecked(isChecked);
    changePubAddresses(
      pubAddressesArr.map(pubAddress => ({
        ...pubAddress,
        isChecked,
      })),
    );
  };

  const onSuccess = () => {
    setProcessing(false);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const submit = async ({ keys }: { keys: WalletKeys }) => {
    const params: {
      fioAddress: string;
      disconnectList: PublicAddressDoublet[];
      keys: WalletKeys;
      disconnectAll: boolean;
    } = {
      fioAddress: fioCryptoHandle.name,
      disconnectList: pubAddressesArr.filter(
        pubAddress => pubAddress.isChecked,
      ),
      keys,
      disconnectAll: allChecked,
    };
    try {
      const actionResults = await minWaitTimeFunction(
        () => linkTokens(params),
        TOKEN_LINK_MIN_WAIT_TIME,
      );
      setResultsData(actionResults);
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
        action={CONFIRM_PIN_ACTIONS.DELETE_TOKEN}
        processing={processing}
        setProcessing={setProcessing}
        fioWalletEdgeId={edgeWalletId}
      />
      <ActionContainer
        containerName={CONTAINER_NAMES.DELETE}
        fioCryptoHandle={fioCryptoHandle}
        bundleCost={bundleCost}
        isDisabled={!hasChecked || remaining === 0}
        onActionButtonClick={onActionClick}
        loading={loading}
        results={resultsData}
        changeBundleCost={changeBundleCost}
        onBack={onBack}
        onRetry={onRetry}
      >
        <div className={classes.container}>
          <div className={classes.actionContainer}>
            <h5 className={classes.subtitle}>Linked Tokens</h5>
            <div className={classes.selectContainer}>
              <p className={classes.label}>Select</p>
              <CheckedDropdown
                allChecked={allChecked}
                allCheckedChange={allCheckedChange}
                hasLowBalance={hasLowBalance}
              />
            </div>
          </div>
          {pubAddressesArr &&
            pubAddressesArr.map(pubAddress => (
              <DeleteTokenItem
                {...pubAddress}
                onCheckClick={onCheckClick}
                hasLowBalance={hasLowBalance}
                key={pubAddress.id}
              />
            ))}
        </div>
      </ActionContainer>
    </>
  );
};

export default DeleteTokenPage;
