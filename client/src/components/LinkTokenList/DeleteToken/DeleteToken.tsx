import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import ActionContainer, {
  CONTAINER_NAMES,
} from '../containers/ActionContainer';
import ConfirmContainer from '../containers/ConfirmContainer';
import CheckedDropdown from './CheckedDropdown';
import DeleteTokenItem from './DeleteTokenItem';
import { ROUTES } from '../../../constants/routes';

import { CheckedTokenType } from './types';
import { FioNameItemProps } from '../../../types';

import classes from './DeleteToken.module.scss';

type Props = {
  results?: any; // todo: set results types
  currentFioAddress: FioNameItemProps;
};

const DeleteToken: React.FC<Props> = props => {
  const { currentFioAddress, results } = props;
  const { name, publicAddresses, remaining = 0 } = currentFioAddress;

  const [pubAddressesArr, changePubAddresses] = useState<CheckedTokenType[]>(
    [],
  );
  const [bundleCost, changeBundleCost] = useState(0);
  const [allChecked, toggleAllChecked] = useState(false);
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

  const allCheckedChange = (flag: boolean) => {
    toggleAllChecked(flag);
    changePubAddresses(
      pubAddressesArr.map(pubAddress => ({
        ...pubAddress,
        isChecked: flag,
      })),
    );
  };

  const handleResults = () => {
    // todo: call delete action here

    if (allChecked) {
      // todo: call remove_all_pub_addresses
      const deleteObjData = {
        fio_address: name,
        // todo: remove mocked data
        /* mocked data start */
        max_fee: 0,
        tpid: 'rewards@wallet',
        actor: 'aftyershcu22',
        /* mocked data end */
      };
    } else {
      const publicAddressesToDelete = pubAddressesArr
        .filter(pubAddress => pubAddress.isChecked)
        .map(pubAddress => ({
          chain_code: pubAddress.chainCode,
          token_code: pubAddress.tokenCode,
          public_address: pubAddress.publicAddress,
        }));
      const deleteObjData = {
        fio_address: name,
        public_addresses: publicAddressesToDelete,
        // todo: remove mocked data
        /* mocked data start */
        max_fee: 0,
        tpid: 'rewards@wallet',
        actor: 'aftyershcu22',
        /* mocked data end */
      };
      // todo: call remove_pub_address
    }
  };

  if (!name) return <Redirect to={{ pathname: ROUTES.FIO_ADDRESSES }} />;

  return !results ? (
    <ActionContainer
      containerName={CONTAINER_NAMES.DELETE}
      name={name}
      bundleCost={bundleCost}
      remaining={remaining}
      isDisabled={!hasChecked || remaining === 0}
      onActionButtonClick={handleResults}
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
  ) : (
    <ConfirmContainer></ConfirmContainer>
  );
};

export default DeleteToken;
