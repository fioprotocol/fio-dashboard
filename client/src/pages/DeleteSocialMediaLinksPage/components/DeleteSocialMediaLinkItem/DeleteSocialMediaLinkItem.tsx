import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { SocialMediaLinkItemComponent } from '../../../../components/SocialMediaLinkItemComponent';

import { CheckedSocialMediaLinkType } from '../../types';

import classes from './DeleteSocialMediaLinkItem.module.scss';

type Props = {
  hasLowBalance: boolean;
  onCheckClick: (id: string) => void;
} & CheckedSocialMediaLinkType;

export const DeleteSocialMediaLinkItem: React.FC<Props> = props => {
  const {
    id,
    isChecked,
    hasLowBalance,
    onCheckClick,
    link,
    iconSrc,
    name,
  } = props;

  const onClick = () => onCheckClick(id);

  return (
    <SocialMediaLinkItemComponent
      link={link}
      iconSrc={iconSrc}
      name={name}
      actionButton={
        <DeleteSocialMediaLinkActionButton
          isInactive={hasLowBalance && !isChecked}
          isChecked={isChecked}
          onClick={onClick}
        />
      }
    />
  );
};

type ActionProps = {
  isChecked: boolean;
  isInactive: boolean;
  onClick: () => void;
};
const voidAction: () => void = () => null;

const DeleteSocialMediaLinkActionButton: React.FC<ActionProps> = props => {
  const { isChecked, isInactive, onClick } = props;

  return (
    <FontAwesomeIcon
      icon={isChecked ? 'check-square' : { prefix: 'far', iconName: 'square' }}
      className={classnames(
        classes.checkIcon,
        isInactive && classes.inactiveIcon,
      )}
      onClick={isInactive ? voidAction : onClick}
    />
  );
};
