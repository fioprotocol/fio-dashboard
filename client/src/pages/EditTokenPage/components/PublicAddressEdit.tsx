import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import TokenBadge from '../../../components/Badges/TokenBadge/TokenBadge';

import { MAX_PUBLIC_ADDRESS_LENGTH } from '../../../constants/fio';

import classes from '../styles/PublicAddressEdit.module.scss';

type Props = {
  chainCode: string;
  handleClick: (id: string, editedPubAddress: string) => void;
  hasLowBalance: boolean;
  id: string;
  newPublicAddress: string;
  isEditing: boolean;
  publicAddress: string;
  tokenCode: string;
};

const EDIT_ICON_CLASS = classes.editIcon;

const PublicAddressEdit: React.FC<Props> = props => {
  const {
    chainCode,
    hasLowBalance,
    handleClick,
    id,
    newPublicAddress,
    isEditing,
    publicAddress,
    tokenCode,
  } = props;

  const [editedPubAddress, changeEditedPubAddress] = useState(publicAddress);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    changeEditedPubAddress(value);
  };

  const onEditClick = (e: any) => {
    const focusedElement = e.relatedTarget;
    const isCurrentAddress =
      focusedElement &&
      focusedElement.classList.contains(EDIT_ICON_CLASS) &&
      focusedElement.id === id;

    if (hasLowBalance || isCurrentAddress) return;
    handleClick(id, editedPubAddress);
  };

  const inputComponent = (
    <input
      type="text"
      value={editedPubAddress}
      onChange={onInputChange}
      autoFocus={true}
      onBlur={onEditClick}
      maxLength={MAX_PUBLIC_ADDRESS_LENGTH}
    />
  );

  const actionButton = (
    <FontAwesomeIcon
      icon="pen"
      className={classnames(
        EDIT_ICON_CLASS,
        (isEditing || newPublicAddress) && classes.editing,
      )}
      onClick={onEditClick}
      tabIndex={0}
      id={id}
    />
  );

  return (
    <TokenBadge
      chainCode={chainCode}
      tokenCode={tokenCode}
      publicAddress={newPublicAddress ? newPublicAddress : publicAddress}
      input={inputComponent}
      actionButton={actionButton}
      showInput={isEditing}
    />
  );
};

export default PublicAddressEdit;
