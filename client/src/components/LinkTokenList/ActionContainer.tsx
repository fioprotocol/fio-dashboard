import React from 'react';
import { Redirect } from 'react-router-dom';

import FioName from '../common/FioName/FioName';
import BundledTransactionBadge from '../Badges/BundledTransactionBadge/BundledTransactionBadge';
import PseudoModalContainer from '../PseudoModalContainer';
import LowBalanceBadge from '../Badges/LowBalanceBadge/LowBalanceBadge';

import LinkTokenListResults from '../common/TransactionResults/components/LinkTokenListResults/';

import SubmitButton from '../../components/common/SubmitButton/SubmitButton';

import { LOW_BALANCE_TEXT, CONTAINER_TYPES } from './constants';
import { ROUTES } from '../../constants/routes';

import { LinkTokenResultsProps } from '../common/TransactionResults/types';

import classes from './styles/ActionContainer.module.scss';

type Props = {
  children?: React.ReactNode;
  isDisabled?: boolean;
  onActionButtonClick: () => void;
  loading?: boolean;
} & LinkTokenResultsProps;

const ActionContainer: React.FC<Props> = props => {
  const {
    bundleCost,
    children,
    containerName,
    isDisabled,
    fioCryptoHandle,
    onActionButtonClick,
    loading,
    results,
    changeBundleCost,
    onBack,
    onRetry,
  } = props;

  const { name, remaining } = fioCryptoHandle;

  const hasLowBalance = remaining - bundleCost < 0;

  if (!name) return <Redirect to={{ pathname: ROUTES.FIO_ADDRESSES }} />;

  if (results)
    return (
      <LinkTokenListResults
        fioCryptoHandle={fioCryptoHandle}
        results={results}
        containerName={containerName}
        bundleCost={bundleCost}
        changeBundleCost={changeBundleCost}
        onBack={onBack}
        onRetry={onRetry}
      />
    );

  return (
    <PseudoModalContainer
      title={CONTAINER_TYPES[containerName].title}
      link={`${ROUTES.LINK_TOKEN_LIST}/${name}`}
      fullWidth={true}
    >
      <div className={classes.actionContainer}>
        <FioName name={name} />
        {children}
        <BundledTransactionBadge bundles={bundleCost} remaining={remaining} />
        <LowBalanceBadge hasLowBalance={hasLowBalance} {...LOW_BALANCE_TEXT} />
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
