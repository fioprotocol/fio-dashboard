import React from 'react';
import { Button } from 'react-bootstrap';

import AddressName from '../Components/Address';
import BundledTransactionBadge from '../Components/BundledTransactionBadge';
import PseudoModalContainer from '../../PseudoModalContainer';
import LowBalanceBadge from '../../Badges/LowBalanceBadge/LowBalanceBadge';
import { ROUTES } from '../../../constants/routes';

import classes from './ContainerStyle.module.scss';

type Props = {
  bundleCost: number;
  children?: React.ReactNode;
  buttonName: string;
  name: string;
  remaining: number;
  title: string;
};

const lowBalanceText = {
  buttonText: 'Renew',
  messageText:
    'Unfortunately there are not enough bundled transactions available to complete linking. Please renew your address now.',
};

const ActionContainer: React.FC<Props> = props => {
  const { bundleCost, buttonName, children, name, remaining, title } = props;

  const hasLowBalance = remaining - bundleCost < 0;
  return (
    <PseudoModalContainer
      title={title}
      link={`${ROUTES.LINK_TOKEN_LIST}/${name}`}
      hasAutoWidth={true}
    >
      <div className={classes.actionContainer}>
        <AddressName name={name} />
        {children}
        <BundledTransactionBadge bundles={bundleCost} remaining={remaining} />
        <LowBalanceBadge hasLowBalance={hasLowBalance} {...lowBalanceText} />
        <Button className={classes.actionButton} disabled={hasLowBalance}>
          {buttonName}
        </Button>
      </div>
    </PseudoModalContainer>
  );
};

export default ActionContainer;
