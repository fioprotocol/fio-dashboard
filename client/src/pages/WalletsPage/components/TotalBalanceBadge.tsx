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
import Amount from '../../../components/common/Amount';

type Props = WalletBalances & {
  publicKey?: string;
  isOpenLockedList?: boolean;
  isNew?: boolean;
};

const Balance = (props: {
  fio: string;
  usdc: string;
  title: string;
  viewDetails?: () => void;
  isNew?: boolean;
}) => {
  const { fio, usdc, title, viewDetails, isNew = false } = props;
  return (
    <div className="container">
      <div
        className={classnames(
          classes.balanceContainer,
          'row flex align-items-center',
        )}
      >
        <p className={classnames(classes.balanceTitle, 'col-sm-3')}>{title}</p>
        <div
          className={classnames(
            classes.balanceValues,
            viewDetails ? 'col-sm-6 mr-3' : 'col-sm-9',
          )}
        >
          <PriceComponent costFio={fio} costUsdc={usdc} isNew={isNew} />
        </div>
        {viewDetails ? (
          <Button
            onClick={viewDetails}
            className={classnames(
              classes.link,
              classes.detailsButton,
              'col-sm-3',
            )}
          >
            View
          </Button>
        ) : null}
      </div>
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
    isNew = false,
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
    <div className={classes.actionBadgeContainer}>
      <div className={classes.totalBadge}>
        <p className={classes.title}>Total FIO Wallets Balance</p>
        <div className={classes.totalFio}>
          <div>
            <Amount value={total.fio} />{' '}
            <span className={classes.totalBalanceSuffix}>FIO</span>
          </div>
          <div className={classes.usdcTotalBalanceSuffix}>
            <Amount value={total.usdc} /> <span>USDC</span>
          </div>
        </div>
        {staked?.nativeFio || locked.nativeFio ? (
          <Balance
            fio={available.fio}
            usdc={available.usdc}
            title="Available"
            isNew={isNew}
          />
        ) : null}
        {locked.nativeFio ? (
          <Balance
            fio={locked.fio}
            usdc={locked.usdc}
            title="Locked"
            viewDetails={() => setShowLockedTokensModalView(true)}
            isNew={isNew}
          />
        ) : null}
        {rewards?.nativeFio ? (
          <Balance
            fio={rewards.fio}
            usdc={rewards.usdc}
            title="Rewards"
            isNew={isNew}
          />
        ) : null}
        {staked?.nativeFio ? (
          <Balance
            fio={staked.fio}
            usdc={staked.usdc}
            title="Staked"
            isNew={isNew}
          />
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
