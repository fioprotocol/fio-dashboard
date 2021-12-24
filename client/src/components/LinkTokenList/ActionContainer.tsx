import React from 'react';

import FioName from '../common/FioName/FioName';
import BundledTransactionBadge from '../Badges/BundledTransactionBadge/BundledTransactionBadge';
import PseudoModalContainer from '../PseudoModalContainer';
import LowBalanceBadge from '../Badges/LowBalanceBadge/LowBalanceBadge';

import SubmitButton from '../../components/common/SubmitButton/SubmitButton';

import { ROUTES } from '../../constants/routes';

import classes from './styles/ActionContainer.module.scss';

type Props = {
  bundleCost: number;
  children?: React.ReactNode;
  containerName: string;
  isDisabled?: boolean;
  name: string;
  onActionButtonClick: () => void;
  remaining: number;
  loading: boolean;
};

const lowBalanceText = {
  buttonText: 'Renew',
  messageText:
    'Unfortunately there are not enough bundled transactions available to complete linking. Please renew your address now.',
};

export const CONTAINER_NAMES = {
  DELETE: 'delete',
  EDIT: 'edit',
  LINK: 'link',
};

const CONTAINER_TYPES = {
  [CONTAINER_NAMES.DELETE]: {
    title: 'Delete Public Address(es)',
    buttonText: 'Delete',
  },
  [CONTAINER_NAMES.EDIT]: {
    title: 'Edit Public Address(es)',
    buttonText: 'Edit',
  },
  [CONTAINER_NAMES.LINK]: {
    title: 'Link your FIO Address',
    buttonText: 'Link Now',
  },
};

const ActionContainer: React.FC<Props> = props => {
  const {
    bundleCost,
    children,
    containerName,
    isDisabled,
    name,
    onActionButtonClick,
    remaining,
    loading,
  } = props;

  const hasLowBalance = remaining - bundleCost < 0;
  return (
    <PseudoModalContainer
      title={CONTAINER_TYPES[containerName].title}
      link={`${ROUTES.LINK_TOKEN_LIST}/${name}`}
      hasAutoWidth={true}
    >
      <div className={classes.actionContainer}>
        <FioName name={name} />
        {children}
        <BundledTransactionBadge bundles={bundleCost} remaining={remaining} />
        <LowBalanceBadge hasLowBalance={hasLowBalance} {...lowBalanceText} />
        <SubmitButton
          disabled={hasLowBalance || isDisabled || loading}
          loading={loading}
          onClick={onActionButtonClick}
          text={CONTAINER_TYPES[containerName].buttonText}
          withTopMargin={true}
        />
      </div>
    </PseudoModalContainer>
  );
};

export default ActionContainer;
