import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import TokenBadge from '../../Badges/TokenBadge/TokenBadge';

import { CheckedTokenType } from './types';

import classes from './DeleteToken.module.scss';

type Props = {
  hasLowBalance: boolean;
  onCheckClick: (id: string) => void;
} & CheckedTokenType;

const DeleteTokenItem: React.FC<Props> = props => {
  const {
    chainCode,
    id,
    isChecked,
    hasLowBalance,
    onCheckClick,
    publicAddress,
    tokenCode,
  } = props;

  const onClick = () => onCheckClick(id);

  return (
    <TokenBadge
      chainCode={chainCode}
      tokenCode={tokenCode}
      publicAddress={publicAddress}
      actionButton={
        <DeleteTokenActionButton
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

const DeleteTokenActionButton: React.FC<ActionProps> = props => {
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

export default DeleteTokenItem;
