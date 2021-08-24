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

  const isInactive = hasLowBalance && !isChecked;

  const onClick = () => !isInactive && onCheckClick(id);
  const actionButton = (
    <FontAwesomeIcon
      icon={isChecked ? 'check-square' : { prefix: 'far', iconName: 'square' }}
      className={classnames(
        classes.checkIcon,
        isInactive && classes.inactiveIcon,
      )}
      onClick={onClick}
    />
  );

  return (
    <TokenBadge
      chainCode={chainCode}
      tokenCode={tokenCode}
      publicAddress={publicAddress}
      actionButton={actionButton}
    />
  );
};

export default DeleteTokenItem;
