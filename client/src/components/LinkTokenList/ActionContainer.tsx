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

import { ResultsProps } from '../common/TransactionResults/components/LinkTokenListResults/LinkTokenListResults';

import classes from './styles/ActionContainer.module.scss';

type Props = {
  children?: React.ReactNode;
  isDisabled?: boolean;
  onActionButtonClick: () => void;
  loading?: boolean;
  walletPublicKey: string;
} & ResultsProps;

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
    results,
    walletPublicKey,
    changeBundleCost,
    onBack,
    onRetry,
  } = props;

  const hasLowBalance = remaining - bundleCost < 0;

  if (!name) return <Redirect to={{ pathname: ROUTES.FIO_ADDRESSES }} />;

  if (results)
    return (
      <LinkTokenListResults
        results={results}
        containerName={containerName}
        name={name}
        remaining={remaining}
        bundleCost={bundleCost}
        changeBundleCost={changeBundleCost}
        onBack={onBack}
        onRetry={onRetry}
        walletPublicKey={walletPublicKey}
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
