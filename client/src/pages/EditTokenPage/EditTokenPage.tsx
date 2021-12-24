import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import ActionContainer, {
  CONTAINER_NAMES,
} from '../../components/LinkTokenList/ActionContainer';
import ConfirmContainer from '../../components/LinkTokenList/ConfirmContainer';
import PublicAddressEdit from './components/PublicAddressEdit';

import classes from './styles/EditTokenPage.module.scss';

// todo: remove all any types
const EditTokenPage: React.FC<any> = props => {
  const { currentFioAddress, results, loading } = props;
  const { name, publicAddresses, remaining } = currentFioAddress;

  const [pubAddressesArr, changePubAddresses] = useState([]);
  const [bundleCost, changeBundleCost] = useState(0);

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

  return !results ? (
    <ActionContainer
      containerName={CONTAINER_NAMES.EDIT}
      name={name}
      bundleCost={bundleCost}
      remaining={remaining}
      onActionButtonClick={() => null} // todo: set action
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
  ) : (
    <ConfirmContainer />
  );
};

export default EditTokenPage;
