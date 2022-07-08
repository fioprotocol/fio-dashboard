import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import { PayWalletInfo } from './PayWalletInfo';

import { useCheckIfDesktop } from '../../../screenType';

import { WalletBalancesItem } from '../../../types';

import classes from './PayWithBadge.module.scss';

type Props = {
  costFree?: boolean;
  walletBalances: WalletBalancesItem;
  walletName?: string;
};

const PayWithBadge: React.FC<Props> = props => {
  const { costFree, walletBalances, walletName } = props;
  const isDesktop = useCheckIfDesktop();

  if (costFree) return null;

  return (
    <>
      {!isDesktop && (
        <h6 className={classnames(classes.subtitle, classes.paymentTitle)}>
          Paying With
        </h6>
      )}
      <Badge type={BADGE_TYPES.WHITE} show>
        <div className={classes.item}>
          {isDesktop && (
            <span className={classnames('boldText', classes.title)}>
              Paying With
            </span>
          )}
          <PayWalletInfo
            walletName={walletName}
            fioBalance={walletBalances.fio}
            usdcBalance={walletBalances.usdc}
          />
        </div>
      </Badge>
    </>
  );
};

export default PayWithBadge;
