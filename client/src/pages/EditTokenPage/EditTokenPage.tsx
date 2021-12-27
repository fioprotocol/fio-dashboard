import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import ActionContainer, {
  CONTAINER_NAMES,
} from '../../components/LinkTokenList/ActionContainer';
import ConfirmContainer from '../../components/LinkTokenList/ConfirmContainer';
import PublicAddressEdit from './components/PublicAddressEdit';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';

import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import classes from './styles/EditTokenPage.module.scss';

// todo: remove all any types
const EditTokenPage: React.FC<any> = props => {
  const { currentFioAddress, loading } = props;
  const { name, publicAddresses, remaining } = currentFioAddress;

  const [pubAddressesArr, changePubAddresses] = useState([]);
  const [bundleCost, changeBundleCost] = useState(0);

  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  const [resultsData, setResultsData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<boolean | null>(null);

  const hasLowBalance = remaining - bundleCost < 0;
  useEffect(() => {
    changePubAddresses(
      publicAddresses.map((pubAddress: any) => ({
        ...pubAddress,
        isEditing: false,
        id: pubAddress.publicAddress,
      })),
    );
  }, []);

  const handleEditTokenItem = (editedId: string, editedPubAddress: string) => {
    const currentAddress = pubAddressesArr.find(
      (pubAddress: any) => pubAddress.id === editedId,
    );
    if (!currentAddress) return;

    const { isEditing } = currentAddress;

    const updatePubAddressArr = () => {
      const updatedArr = pubAddressesArr.map((pubAddress: any) =>
        pubAddress.id === editedId
          ? {
              ...pubAddress,
              publicAddress: editedPubAddress,
              isEditing: !isEditing,
            }
          : { ...pubAddress, isEditing: false },
      );

      const editedCount = updatedArr.filter(
        (pubAddress: any) =>
          pubAddress.publicAddress !== pubAddress.id || pubAddress.isEditing,
      ).length;

      changeBundleCost(Math.ceil(editedCount / 2));
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

  const submit = () => {
    setSubmitData(null);
  };

  const onActionClick = () => {
    setSubmitData(true);
  };

  if (resultsData)
    return (
      <ConfirmContainer
        results={resultsData}
        containerName={CONTAINER_NAMES.EDIT}
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
        containerName={CONTAINER_NAMES.EDIT}
        name={name}
        bundleCost={bundleCost}
        remaining={remaining}
        onActionButtonClick={onActionClick}
        loading={loading}
      >
        <div className={classes.container}>
          <h5 className={classnames(classes.subtitle, classes.hasMargin)}>
            Linked Tokens
          </h5>
        </div>
        {pubAddressesArr &&
          pubAddressesArr.map((pubAddress: any) => (
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
