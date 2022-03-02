import React from 'react';
import { useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';

import { useCheckIfDesktop } from '../../../screenType';

import { FioWalletDoublet } from '../../../types';
import { ROUTES } from '../../../constants/routes';
import { putParamsToUrl } from '../../../utils';
import { useWalletBalances } from '../../../util/hooks';

import classes from '../styles/WalletItem.module.scss';

type Props = {
  fioWallet: FioWalletDoublet;
};

const WalletItem: React.FC<Props> = props => {
  const { fioWallet } = props;
  const isDesktop = useCheckIfDesktop();
  const history = useHistory();

  const { total: walletBalancesTotal } = useWalletBalances(fioWallet.publicKey);

  const goToWallet = () => {
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, {
        publicKey: fioWallet.publicKey,
      }),
    );
  };

  return (
    <div className={classes.container} onClick={goToWallet}>
      <Badge type={BADGE_TYPES.BORDERED} show={true}>
        <div className={classes.badgeItem}>
          {isDesktop && <p className={classes.walletName}>{fioWallet.name}</p>}
          <div className={classes.itemContainer}>
            <div className={classes.balanceContainer}>
              <p className={classes.totalBalance}>Total balance</p>
              <p className={classes.balanceValue}>
                {walletBalancesTotal.fio} FIO / {walletBalancesTotal.usdc} USDC
              </p>
            </div>
          </div>

          <FontAwesomeIcon
            icon="chevron-right"
            className={classes.detailsButton}
          />
        </div>
      </Badge>
    </div>
  );
};

export default WalletItem;
