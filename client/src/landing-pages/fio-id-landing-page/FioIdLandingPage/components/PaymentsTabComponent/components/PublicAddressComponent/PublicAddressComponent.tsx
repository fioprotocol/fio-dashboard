import React, { useCallback } from 'react';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import Badge, {
  BADGE_TYPES,
} from '../../../../../../../components/Badge/Badge';

import { PublicAddressItem } from '../../../PaymentsTabComponent/PaymentsTabComponentContext';

import { ChainComponent } from '../ChainComponent';

import classes from './PublicAddressComponent.module.scss';

type Props = {
  publicAddressItem: PublicAddressItem;
  onItemClick: (publicAddress: PublicAddressItem) => void;
};

export const PublicAddressComponent: React.FC<Props> = props => {
  const { publicAddressItem, onItemClick } = props;

  const {
    chainCodeName,
    iconSrc,
    tokenCodeName,
    tokenCode,
  } = publicAddressItem;

  const onClick = useCallback(() => {
    onItemClick(publicAddressItem);
  }, [onItemClick, publicAddressItem]);

  return (
    <Badge
      show
      className={classes.container}
      type={BADGE_TYPES.WHITE}
      onClick={onClick}
    >
      <ChainComponent
        chainCodeName={chainCodeName}
        iconSrc={iconSrc}
        tokenCodeName={tokenCodeName}
        tokenCode={tokenCode}
      />
      <ArrowForwardIosIcon className={classes.arrow} />
    </Badge>
  );
};
