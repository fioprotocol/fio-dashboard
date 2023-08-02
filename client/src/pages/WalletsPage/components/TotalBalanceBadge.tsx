import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import Modal from '../../../components/Modal/Modal';
import { PriceComponent } from '../../../components/PriceComponent';

import { ROUTES } from '../../../constants/routes';
import { US_LOCALE } from '../../../constants/common';
import { QUERY_PARAMS_NAMES } from '../../../constants/queryParams';

import { UnlockPeriod, WalletBalances } from '../../../types';

import classes from '../styles/TotalBalanceBadge.module.scss';

type Props = WalletBalances & {
  publicKey?: string;
  isOpenLockedList?: boolean;
  isNew?: boolean;
  isMobile?: boolean;
  itTotalWallets?: boolean;
};

const Balance = (props: {
  fio: string;
  usdc: string;
  title: string;
  viewDetails?: () => void;
  isNew?: boolean;
}) => {
  const { fio, usdc, title, viewDetails } = props;
  return (
    <div className={classes.balanceContainer}>
      <div className={classes.balanceContentContainer}>
        <p className={classes.balanceTitle}>{title}</p>
        <div className={classes.balanceValues}>
          <PriceComponent costFio={fio} costUsdc={usdc} />
        </div>
      </div>
      {viewDetails ? (
        <Button onClick={viewDetails} className={classes.detailsButton}>
          View
        </Button>
      ) : null}
    </div>
  );
};

const LockedItemsList = ({ data }: { data?: UnlockPeriod[] }) => {
  if (!data) return null;

  return (
    <div className={classnames(classes.itemsList)}>
      {data.map((o, i) => (
        <div
          key={o.date?.getTime()}
          className={classnames(classes.itemContainer, 'row')}
        >
          <p className={classnames(classes.itemData, 'col-5')}>
            {o.date?.toLocaleDateString(US_LOCALE)} @{' '}
            {o.date?.toLocaleTimeString(US_LOCALE)}
          </p>
          <div className={classnames(classes.itemData, 'col-7')}>
            <PriceComponent costFio={o.fio} costUsdc={o.usdc} />
          </div>
        </div>
      ))}
    </div>
  );
};

const TotalBalanceBadge: React.FC<Props> = props => {
  const {
    total,
    available,
    locked,
    rewards,
    staked,
    unlockPeriods,
    publicKey,
    isOpenLockedList,
    isMobile = false,
    itTotalWallets = false,
  } = props;

  const [showLockedTokensModalView, setShowLockedTokensModalView] = useState(
    false,
  );

  useEffect(() => {
    setShowLockedTokensModalView(!!isOpenLockedList);
  }, [isOpenLockedList]);

  const handleCloseModal = () => {
    setShowLockedTokensModalView(false);
  };

  return (
    <div
      className={classnames(
        classes.actionBadgeContainer,
        isMobile && classes.onlyMobile,
      )}
    >
      <div className={classes.totalBadge}>
        <p className={classes.title}>
          Total {itTotalWallets && 'Wallets'} FIO Balance
        </p>
        <div className={classes.totalFio}>
          <PriceComponent costFio={total.fio} costUsdc={total.usdc} />
        </div>
        {staked?.nativeFio || locked.nativeFio ? (
          <Balance
            fio={available.fio}
            usdc={available.usdc}
            title="Available"
          />
        ) : null}
        {locked.nativeFio ? (
          <Balance
            fio={locked.fio}
            usdc={locked.usdc}
            title="Locked"
            viewDetails={() => setShowLockedTokensModalView(true)}
          />
        ) : null}
        {rewards?.nativeFio ? (
          <Balance fio={rewards.fio} usdc={rewards.usdc} title="Rewards" />
        ) : null}
        {staked?.nativeFio ? (
          <Balance fio={staked.fio} usdc={staked.usdc} title="Staked" />
        ) : null}

        {publicKey ? (
          <div className={classes.actionButtons}>
            <Link
              to={{
                pathname: ROUTES.STAKE,
                search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${publicKey}`,
              }}
              className={classes.link}
            >
              Stake
            </Link>
            <Link
              to={{
                pathname: ROUTES.UNSTAKE,
                search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${publicKey}`,
              }}
              className={classnames(classes.link, classes.secondary)}
            >
              Unstake
            </Link>
          </div>
        ) : null}
      </div>

      <Modal
        show={showLockedTokensModalView}
        closeButton={true}
        onClose={handleCloseModal}
        isSimple={true}
        isWide={true}
        hasDefaultCloseColor={true}
      >
        <div className={classes.modalContainer}>
          <h2 className={classes.title}>Locked FIO Tokens</h2>
          <div className="container">
            <div className={classnames(classes.subtitleContainer, 'row')}>
              <div className={classnames(classes.subtitle, 'col-5')}>
                Unlocked Date
              </div>
              <div className={classnames(classes.subtitle, 'col-7')}>
                Amount
              </div>
            </div>
            <LockedItemsList data={unlockPeriods} />
          </div>
          <div className="d-flex justify-content-center">
            <Button className={classes.closeButton} onClick={handleCloseModal}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TotalBalanceBadge;
