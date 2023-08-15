import React from 'react';
import { useHistory } from 'react-router-dom';

import FioName from '../common/FioName/FioName';
import BundledTransactionBadge from '../Badges/BundledTransactionBadge/BundledTransactionBadge';
import PseudoModalContainer from '../PseudoModalContainer';
import LowBalanceBadge from '../Badges/LowBalanceBadge/LowBalanceBadge';
import PageTitle from '../PageTitle/PageTitle';

import LinkTokenListResults from '../common/TransactionResults/components/LinkTokenListResults/';

import SubmitButton from '../../components/common/SubmitButton/SubmitButton';

import { LOW_BALANCE_TEXT, CONTAINER_TYPES } from './constants';
import { ROUTES } from '../../constants/routes';
import { LINKS } from '../../constants/labels';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { LinkTokenResultsProps } from '../common/TransactionResults/types';
import { FioWalletDoublet } from '../../types';

import classes from './styles/ActionContainer.module.scss';

type Props = {
  children?: React.ReactNode;
  isDisabled?: boolean;
  onActionButtonClick: () => void;
  loading?: boolean;
  fioWallets?: FioWalletDoublet[];
  link?: string;
  hasFullWidth?: boolean;
} & Partial<LinkTokenResultsProps>;

const ActionContainer: React.FC<Props> = props => {
  const {
    bundleCost,
    children,
    containerName,
    isDisabled,
    fioCryptoHandleObj,
    link = ROUTES.LINK_TOKEN_LIST,
    hasFullWidth = true,
    onActionButtonClick,
    loading,
    results,
    changeBundleCost,
    onBack,
    onRetry,
  } = props;

  const history = useHistory();
  const { name, remaining } = fioCryptoHandleObj || {};
  const hasLowBalance = remaining - bundleCost < 0;

  if (results)
    return (
      <>
        <PageTitle link={LINKS.ADD_TOKEN_CONFIRMATION} isVirtualPage />
        <LinkTokenListResults
          fioCryptoHandleObj={fioCryptoHandleObj}
          results={results}
          containerName={containerName}
          bundleCost={bundleCost}
          changeBundleCost={changeBundleCost}
          onBack={onBack}
          onRetry={onRetry}
        />
      </>
    );

  const onLowBalanceActionClick = () =>
    history.push(
      `${ROUTES.FIO_ADDRESS_ADD_BUNDLES}?${QUERY_PARAMS_NAMES.NAME}=${name}`,
      {
        backUrl: `${link}?${QUERY_PARAMS_NAMES.FIO_HANDLE}=${name}`,
      },
    );

  return (
    <PseudoModalContainer
      title={CONTAINER_TYPES[containerName].title}
      link={`${link}?${QUERY_PARAMS_NAMES.FIO_HANDLE}=${name}`}
      fullWidth={hasFullWidth}
    >
      <div className={classes.actionContainer}>
        <FioName name={name} />
        {children}
        <h5 className={classes.subtitle}>Bundled Transaction Details</h5>
        <BundledTransactionBadge bundles={bundleCost} remaining={remaining} />
        <LowBalanceBadge
          onActionClick={onLowBalanceActionClick}
          hasLowBalance={hasLowBalance}
          {...LOW_BALANCE_TEXT}
        />
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
