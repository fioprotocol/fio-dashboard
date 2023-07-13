import React from 'react';
import { useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import { PriceComponent } from '../../../components/PriceComponent';
import LedgerBadge from '../../../components/Badges/LedgerBadge/LedgerBadge';

import { useCheckIfDesktop } from '../../../screenType';

import { ROUTES } from '../../../constants/routes';
import { WALLET_CREATED_FROM } from '../../../constants/common';
import { QUERY_PARAMS_NAMES } from '../../../constants/queryParams';

import { useWalletBalances } from '../../../util/hooks';

import { FioWalletDoublet } from '../../../types';

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
    history.push({
      pathname: ROUTES.FIO_WALLET,
      search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}`,
    });
  };

  return (
    <div className={classes.container} onClick={goToWallet}>
      <Badge type={BADGE_TYPES.BORDERED} show={true}>
        <div
          className={classnames(
            classes.badgeItem,
            isDesktop && classes.isDesktopView,
          )}
        >
          <p className={classes.walletName}>{fioWallet.name}</p>
          <div className={classes.itemContainer}>
            <div className={classes.balanceContainer}>
              <p className={classes.totalBalance}>Total balance</p>
              <div className={classes.balanceValue}>
                <PriceComponent
                  costFio={walletBalancesTotal.fio}
                  costUsdc={walletBalancesTotal.usdc}
                  isNew
                />
              </div>
            </div>
            {fioWallet.from === WALLET_CREATED_FROM.LEDGER ? (
              <div className={classes.ledgerContainer}>
                <LedgerBadge />
              </div>
            ) : null}
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
