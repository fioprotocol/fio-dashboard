import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import ActionContainer from '../Containers/ActionContainer';
import ConfirmContainer from '../Containers/ConfirmContainer';
import PublicAddressEdit from '../Components/PublicAddressEdit';

import classes from './EditToken.module.scss';

// todo: remove all any types
const EditToken: React.FC<any> = props => {
  const { currentFioAddress, results } = props;
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

    const { id, isEditing } = currentAddress;
    const exactPubAddress = id === editedPubAddress;

    const editedCount = pubAddressesArr.filter(
      (pubAddress: any) => pubAddress.publicAddress !== pubAddress.id,
    ).length;

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
      changePubAddresses(updatedArr);
    };

    // todo: handle bundle count this one works in other manner
    if (!isEditing) {
      if (
        (editedCount === 0 || editedCount % 5 === 0) &&
        !hasLowBalance &&
        exactPubAddress
      ) {
        changeBundleCost(bundleCost + 1);
      }
    } else {
      if ((editedCount === 1 || editedCount % 6 === 0) && exactPubAddress) {
        bundleCost - 1 >= 0 && changeBundleCost(bundleCost - 1);
      }
    }
    updatePubAddressArr();
  };

  return !results ? (
    <ActionContainer
      buttonName="Edit"
      name={name}
      title="Edit Public Address(es)"
      bundleCost={bundleCost}
      remaining={remaining}
    >
      <div className={classes.container}>
        <h5 className={classnames(classes.subTitle, classes.editSubtitle)}>
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
    <ConfirmContainer></ConfirmContainer>
  );
};

export default EditToken;
