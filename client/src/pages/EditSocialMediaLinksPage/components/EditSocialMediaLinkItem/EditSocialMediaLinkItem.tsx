import React, { useState, FormEvent } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import classnames from 'classnames';

import { SocialMediaLinkItemComponent } from '../../../../components/SocialMediaLinkItemComponent';
import { extractLastValueFormUrl, isURL } from '../../../../util/general';

import { EditSocialLinkItem } from '../../types';

import classes from './EditSocialMediaLinkItem.module.scss';

type Props = {
  handleClick: (id: string, editedLink: string) => void;
  hasLowBalance: boolean;
} & EditSocialLinkItem;

const EDIT_ICON_CLASS = classes.editIcon;

export const EditSocialMediaLinkItem: React.FC<Props> = props => {
  const {
    hasLowBalance,
    id,
    newUsername,
    isEditing,
    link,
    iconSrc,
    name,
    username,
    handleClick,
  } = props;

  const [editedLink, changeEditedLink] = useState(username);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    changeEditedLink(value);
  };

  const onEditClick = (e: FormEvent) => {
    e.preventDefault();
    if (hasLowBalance) return;
    handleClick(id, editedLink);
  };

  const onInputBlur = (
    e: React.FocusEvent<HTMLElement> & React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    const focusedElement = e.relatedTarget as Element;

    const isCurrentUsername =
      focusedElement &&
      focusedElement.classList.contains(EDIT_ICON_CLASS) &&
      focusedElement.id === id;

    const value = e.target.value;

    let editedValue = value;

    if (isURL(value)) {
      editedValue = extractLastValueFormUrl(value);
    } else {
      if (value.startsWith('@')) {
        editedValue = value.substr(1);
      }
    }

    changeEditedLink(editedValue);

    if (hasLowBalance || isCurrentUsername) return;
    handleClick(id, editedValue);
  };

  const inputComponent = (
    <input
      type="text"
      value={editedLink}
      onChange={onInputChange}
      autoFocus={true}
      onBlur={onInputBlur}
    />
  );

  const actionButton = (
    <EditIcon
      className={classnames(EDIT_ICON_CLASS, isEditing && classes.editing)}
      onClick={onEditClick}
      id={id}
    />
  );

  return (
    <SocialMediaLinkItemComponent
      showInput={isEditing}
      input={inputComponent}
      link={isEditing ? link : link + (newUsername || username)}
      iconSrc={iconSrc}
      name={name}
      actionButton={actionButton}
      combineInputAndLink={isEditing}
      hasOpacity={!isEditing && !newUsername}
    />
  );
};
