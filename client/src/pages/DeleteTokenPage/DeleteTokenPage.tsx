import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import ActionContainer, {
  CONTAINER_NAMES,
} from '../../components/LinkTokenList/ActionContainer';
import ConfirmContainer from '../../components/LinkTokenList/ConfirmContainer';
import CheckedDropdown from './components/CheckedDropdown';
import DeleteTokenItem from './components/DeleteTokenItem';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';

import { ROUTES } from '../../constants/routes';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import { CheckedTokenType } from './types';
import { FioNameItemProps } from '../../types';

import classes from './styles/DeleteToken.module.scss';

type Props = {
  results?: any; // todo: set results types
  currentFioAddress: FioNameItemProps;
  onSubmit: (params: any) => void;
  loading: boolean;
};

const DeleteTokenPage: React.FC<Props> = props => {
  const { currentFioAddress, onSubmit, loading } = props;
  const { name, publicAddresses, remaining = 0 } = currentFioAddress;

  const [pubAddressesArr, changePubAddresses] = useState<CheckedTokenType[]>(
    [],
  );
  const [bundleCost, changeBundleCost] = useState(0);
  const [allChecked, toggleAllChecked] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<boolean | null>(null);
  // @ts-ignorea
  // eslint-disable-next-line no-unused-vars
  const [resultsData, setResultsData] = useState<any | null>(null);

  const hasLowBalance = remaining - bundleCost < 0 || remaining === 0;

  const hasChecked = pubAddressesArr.some(pubAddress => pubAddress.isChecked);

  useEffect(() => {
    changePubAddresses(
      publicAddresses.map(pubAddress => ({
        ...pubAddress,
        isChecked: false,
        id: pubAddress.publicAddress,
      })),
    );
  }, []);

  useEffect(() => {
    hasChecked ? changeBundleCost(1) : changeBundleCost(0);
  }, [hasChecked]);

  useEffect(() => {
    toggleAllChecked(pubAddressesArr.every(pubAddress => pubAddress.isChecked));
  }, [pubAddressesArr]);

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

  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  const handleResults = () => {
    // todo: call delete action here

    if (allChecked) {
      // todo: call remove_all_pub_addresses
      onSubmit({
        fioAddress: name,
        fee: 0,
      });
    } else {
      onSubmit({
        disconnectList: pubAddressesArr
          .filter(pubAddress => pubAddress.isChecked)
          .map(pubAddress => ({
            chain_code: pubAddress.chainCode,
            token_code: pubAddress.tokenCode,
            public_address: pubAddress.publicAddress,
          })),
        fioAddress: name,
        fee: 0,
      });
    }
  };

  const onSuccess = () => {
    setProcessing(false);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const submit = () => {
    setSubmitData(null);
  };

  const onActionClick = () => {
    setSubmitData(true);
  };

  if (!name) return <Redirect to={{ pathname: ROUTES.FIO_ADDRESSES }} />;

  if (resultsData)
    return (
      <ConfirmContainer
        results={resultsData}
        containerName={CONTAINER_NAMES.DELETE}
        name={name}
        remaining={remaining}
        loading={loading}
      />
    );
  return (
    <>
      <EdgeConfirmAction
        onSuccess={onSuccess}
        onCancel={onCancel}
        submitAction={submit}
        data={submitData}
        action={CONFIRM_PIN_ACTIONS.TOKEN_LIST}
        processing={processing}
        setProcessing={setProcessing}
        hideProcessing={true}
      />
      <ActionContainer
        containerName={CONTAINER_NAMES.DELETE}
        name={name}
        bundleCost={bundleCost}
        remaining={remaining}
        isDisabled={!hasChecked || remaining === 0}
        onActionButtonClick={onActionClick}
        loading={loading}
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
