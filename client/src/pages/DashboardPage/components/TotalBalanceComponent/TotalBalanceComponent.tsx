import React from 'react';
import { Link } from 'react-router-dom';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import Loader from '../../../../components/Loader/Loader';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import { PriceComponent } from '../../../../components/PriceComponent';

import { ItemWrapper } from '../ItemWrapper';

import { ROUTES } from '../../../../constants/routes';

import MathOp from '../../../../util/math';

import { WalletBalancesItem } from '../../../../types';

import classes from './TotalBalanceComponent.module.scss';

type Props = {
  totalBalance: WalletBalancesItem;
  loading: boolean;
};

type ActionButtonContainerProps = {
  show: boolean;
};

const ActionButtonContainer: React.FC<ActionButtonContainerProps> = props => {
  if (!props.show) return null;

  return <div className={classes.actionButtonContainer}>{props.children}</div>;
};

export const TotalBalanceComponent: React.FC<Props> = props => {
  const { loading, totalBalance } = props;

  return (
    <ItemWrapper hasSmallBorderRadius>
      <Badge
        show
        type={BADGE_TYPES.BLACK}
        hasDefaultFontSize
        withoutMargin
        withoutMaxWidth
      >
        <div className={classes.badgeContainer}>
          <p className={classes.title}>Total FIO Wallet Balance:</p>
          <div className={classes.balance}>
            <span className={classes.mainBalance}>
              <PriceComponent
                costFio={totalBalance.fio}
                costUsdc={totalBalance.usdc}
                loading={loading}
                loaderComponent={
                  <Loader isWhite styles={{ width: '16px', height: '16px' }} />
                }
              />
            </span>
          </div>
          <div className={classes.actionContainer}>
            <ActionButtonContainer
              show={!loading && new MathOp(totalBalance?.fio).eq(0)}
            >
              <Link to={ROUTES.FIO_TOKENS_GET}>
                <SubmitButton
                  hasAutoHeight
                  isButtonType
                  isWhite
                  hasNoSidePaddings
                  text={
                    <span className={classes.actionText}>Buy FIO Tokens</span>
                  }
                />
              </Link>
            </ActionButtonContainer>
            <ActionButtonContainer
              show={!loading && new MathOp(totalBalance?.fio).eq(0)}
            >
              <Link to={ROUTES.IMPORT_WALLET}>
                <SubmitButton
                  hasAutoHeight
                  isButtonType
                  isWhiteBordered
                  isTransparent
                  hasWhiteHoverBackground
                  hasHoveredBlackTextColor
                  hasNoSidePaddings
                  text={
                    <span className={classes.actionText}>Import Wallet</span>
                  }
                />
              </Link>
            </ActionButtonContainer>
            <ActionButtonContainer
              show={!loading && new MathOp(totalBalance?.fio).gt(0)}
            >
              <Link to={ROUTES.TOKENS}>
                <SubmitButton
                  hasAutoHeight
                  isButtonType
                  isWhite
                  hasNoSidePaddings
                  text={
                    <span className={classes.actionText}>Manage Wallets</span>
                  }
                />
              </Link>
            </ActionButtonContainer>
          </div>
        </div>
      </Badge>
    </ItemWrapper>
  );
};
