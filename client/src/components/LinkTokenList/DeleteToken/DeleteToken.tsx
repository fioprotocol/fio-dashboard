import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import Dropdown from 'react-dropdown';

import ActionContainer, {
  CONTAINER_NAMES,
} from '../Containers/ActionContainer';
import ConfirmContainer from '../Containers/ConfirmContainer';
import PublicAddressDelete from '../Components/PublicAddressDelete';

import { CheckedPublicAddressType } from '../types';

import classes from './DeleteToken.module.scss';

const DROPDOWN_OPTIONS = {
  ALL: 'All',
  NONE: 'None',
};

// todo: set type props for component
const DeleteToken: React.FC<any> = props => {
  const { currentFioAddress, results } = props;
  const { name, publicAddresses, remaining = 0 } = currentFioAddress;

  const [pubAddressesArr, changePubAddresses] = useState<
    CheckedPublicAddressType[]
  >([]);
  const [bundleCost, changeBundleCost] = useState(0);
  const [allChecked, toggleAllChecked] = useState(false);
  const hasLowBalance = remaining - bundleCost < 0;

  const hasChecked = pubAddressesArr.some(pubAddress => pubAddress.isChecked);

  useEffect(() => {
    changePubAddresses(
      publicAddresses.map((pubAddress: CheckedPublicAddressType) => ({
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

  const isDisabledCheckbox = !allChecked && hasLowBalance;

  const onCheckboxClick = () => {
    if (!isDisabledCheckbox) return allCheckedChange(!allChecked);
  };

  const isDisabledOption = (option: string) => {
    const isAllCheckedOption = option === DROPDOWN_OPTIONS.ALL;
    return hasLowBalance && isAllCheckedOption;
  };

  const styledOptions = Object.values(DROPDOWN_OPTIONS).map(option => ({
    value: option,
    label: option,
    className: classnames(
      classes.optionItem,
      isDisabledOption(option) && classes.isDisabled,
    ),
  }));

  const onDropdownChange = (option: {
    value: string;
    label: React.ReactNode;
  }) => {
    const { value } = option;
    const isAllCheckedOption = value === DROPDOWN_OPTIONS.ALL;

    if (isDisabledOption(value)) return;
    allCheckedChange(isAllCheckedOption);
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
      console.log(deleteObjData);
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
      console.log(deleteObjData);

      // todo: call remove_pub_address
    }
  };

  return !results ? (
    <ActionContainer
      containerName={CONTAINER_NAMES.DELETE}
      name={name}
      bundleCost={bundleCost}
      remaining={remaining}
      isDisabled={!hasChecked}
      onActionButtonClick={handleResults}
    >
      <div className={classes.container}>
        <div className={classes.actionContainer}>
          <h5 className={classnames(classes.subTitle, classes.checkedSubtitle)}>
            Linked Tokens
          </h5>
          <div className={classes.selectContainer}>
            <p className={classes.label}>Select</p>
            <div className={classes.dropdownContainer}>
              <FontAwesomeIcon
                icon={
                  allChecked
                    ? 'check-square'
                    : { prefix: 'far', iconName: 'square' }
                }
                onClick={onCheckboxClick}
                className={classnames(
                  classes.allChecked,
                  isDisabledCheckbox && classes.isDisabled,
                )}
              />
              <Dropdown
                options={styledOptions}
                onChange={onDropdownChange}
                className={classes.dropdown}
                controlClassName={classes.control}
                placeholderClassName={classes.placeholder}
                menuClassName={classes.menu}
                arrowClosed={
                  <FontAwesomeIcon
                    icon="chevron-down"
                    className={classes.icon}
                  />
                }
                arrowOpen={
                  <FontAwesomeIcon icon="chevron-up" className={classes.icon} />
                }
              />
            </div>
          </div>
        </div>
        {pubAddressesArr &&
          pubAddressesArr.map(pubAddress => (
            <PublicAddressDelete
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
