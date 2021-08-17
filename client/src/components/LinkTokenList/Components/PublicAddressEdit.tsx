import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import classes from './PublicAddress.module.scss';

type Props = {
  chainCode: string;
  handleClick: (id: string, editedPubAddress: string) => void;
  hasLowBalance: boolean;
  id: string;
  isEdited: boolean;
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
    isEdited,
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

  return (
    <Badge show={true} type={BADGE_TYPES.WHITE}>
      <div className={classes.badgeContainer}>
        <div className={classes.publicAddressContainer}>
          <p className="boldText">{tokenCode}</p>
          <p className={classes.chainCode}>
            Chain Code: <span className="boldText">{chainCode}</span>
          </p>
          {isEditing ? (
            <input
              type="text"
              value={editedPubAddress}
              onChange={onInputChange}
              className={classes.input}
              size={editedPubAddress.length * 1.2} // makes width of input almost the same as text
              autoFocus={true}
              onBlur={onEditClick}
            />
          ) : (
            <p className={classes.publicAddressItem}>{publicAddress}</p>
          )}
        </div>
        <FontAwesomeIcon
          icon="pen"
          className={classnames(
            EDIT_ICON_CLASS,
            (isEditing || isEdited) && classes.editing,
          )}
          onClick={onEditClick}
          tabIndex={0}
          id={id}
        />
      </div>
    </Badge>
  );
};

export default PublicAddressEdit;
