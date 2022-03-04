import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import Amount from '../../../components/common/Amount';
import Modal from '../../../components/Modal/Modal';

import { ROUTES } from '../../../constants/routes';

import { priceToNumber, putParamsToUrl } from '../../../utils';

import { WalletBalances } from '../../../types';

import classes from '../styles/TotalBalanceBadge.module.scss';

type Props = WalletBalances;

const Balance = (props: {
  fio: string;
  usdc: string;
  title: string;
  viewDetails?: () => void;
}) => {
  const { fio, usdc, title, viewDetails } = props;
  return (
    <div className="container">
      <div className={classnames(classes.balanceContainer, 'row flex')}>
        <p className={classnames(classes.balanceTitle, 'col-sm-3')}>{title}</p>
        <p
          className={classnames(
            classes.balanceValues,
            viewDetails ? 'col-sm-6' : 'col-sm-9',
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

const LockedItemsList = ({
  data,
}: {
  data: { fio: string; usdc: string; unlockDate: any }[];
}) => {
  return (
    <div className={classnames(classes.itemsList)}>
      {data.map((o, i) => (
        <div
          key={o.unlockDate}
          className={classnames(classes.itemContainer, 'row')}
        >
          <p className={classnames(classes.itemData, 'col-5')}>
            {o.unlockDate}
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
    // locked,
    rewards = { fio: '0', usdc: '0', nativeFio: 0 },
    staked = { fio: '0', usdc: '0', nativeFio: 0 },
  } = props;

  // todo: use real data
  const locked = { fio: '1200000000345', usdc: '10', nativeFio: 120000 };
  const lockedList = [
    { unlockDate: '01/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
    { unlockDate: '02/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
    { unlockDate: '03/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
    { unlockDate: '04/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
    { unlockDate: '05/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
    { unlockDate: '06/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
    { unlockDate: '07/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
    { unlockDate: '08/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
    { unlockDate: '09/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
    { unlockDate: '10/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
    { unlockDate: '11/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
    { unlockDate: '12/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
    { unlockDate: '13/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
    { unlockDate: '14/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
    { unlockDate: '15/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
    { unlockDate: '16/00/0000 @ 00:00 AM', fio: '23', usdc: '7' },
  ];

  const [showLockedTokensModalView, setShowLockedTokensModalView] = useState(
    false,
  );

  const { publicKey } = useParams();

  const handleCloseModal = () => {
    setShowLockedTokensModalView(false);
  };

  return (
    <div className={classes.actionBadgeContainer}>
      <div className={classes.totalBadge}>
        <p className={classes.title}>Total FIO Wallets Balance</p>
        <p className={classes.totalFio}>
          <Amount value={priceToNumber(total.fio)} /> FIO
        </p>
        <p className={classes.totalUsdc}>
          <Amount value={priceToNumber(total.usdc)} /> USDC
        </p>
        <Balance fio={available.fio} usdc={available.usdc} title="Available" />
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
            <LockedItemsList data={lockedList} />
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
