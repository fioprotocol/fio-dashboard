import React, { useCallback } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';

import TokenBadge from '../../../components/Badges/TokenBadge/TokenBadge';

import { PublicAddressDoublet } from '../../../types';

import classes from '../styles/AddToken.module.scss';

type Props = {
  token: PublicAddressDoublet;
  index: number;
  onRemove: (index: number) => void;
};

export const AddTokenBadge: React.FC<Props> = props => {
  const { token, index, onRemove } = props;

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <TokenBadge
      {...token}
      actionButton={
        <CancelIcon className={classes.closeIcon} onClick={handleRemove} />
      }
    />
  );
};
