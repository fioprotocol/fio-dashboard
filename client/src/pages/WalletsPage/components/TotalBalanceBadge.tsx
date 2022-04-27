import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import Amount from '../../../components/common/Amount';
import Modal from '../../../components/Modal/Modal';

import { ROUTES } from '../../../constants/routes';
import { US_LOCALE } from '../../../constants/common';

import { priceToNumber, putParamsToUrl } from '../../../utils';

import { UnlockPeriod, WalletBalances } from '../../../types';

import classes from '../styles/TotalBalanceBadge.module.scss';

type Props = WalletBalances & {
  publicKey?: string;
  isOpenLockedList?: boolean;
};

const Balance = (props: {
  fio: string;
  usdc: string;
  title: string;
  viewDetails?: () => void;
}) => {
  const { fio, usdc, title, viewDetails } = props;
  return (
    <div className="container">
      <div
        className={classnames(
          classes.balanceContainer,
          'row flex align-items-center',
        )}
      >
        <p className={classnames(classes.balanceTitle, 'col-sm-3')}>{title}</p>
        <p
          className={classnames(
            classes.balanceValues,
            viewDetails ? 'col-sm-6 mr-3' : 'col-sm-9',
          )}
        >
          <Amount value={priceToNumber(fio)} /> FIO /{' '}
          <Amount value={priceToNumber(usdc)} /> USDC
        </p>
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
          <p className={classnames(classes.itemData, 'col-7')}>
            <Amount value={priceToNumber(o.fio)} /> FIO (&#36;
            <Amount value={priceToNumber(o.usdc)} /> USDC)
          </p>
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
        <p className={classes.totalFio}>
          <Amount value={total.fio} /> FIO
        </p>
        <p className={classes.totalUsdc}>
          <Amount value={total.usdc} /> USDC
        </p>
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
              to={putParamsToUrl(ROUTES.STAKE, {
                publicKey,
              })}
              className={classes.link}
            >
              Stake
            </Link>
            <Link
              to={putParamsToUrl(ROUTES.UNSTAKE, {
                publicKey,
              })}
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
