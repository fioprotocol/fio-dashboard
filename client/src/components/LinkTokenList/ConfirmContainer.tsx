import React from 'react';
import { useHistory } from 'react-router-dom';

import PseudoModalContainer from '../PseudoModalContainer';
import FioName from '../common/FioName/FioName';

import BundledTransactionBadge from '../Badges/BundledTransactionBadge/BundledTransactionBadge';
import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import { BADGE_TYPES } from '../Badge/Badge';
import TokenBadge from '../Badges/TokenBadge/TokenBadge';
import InfoBadge from '../InfoBadge/InfoBadge';

import { CONTAINER_NAMES } from './ActionContainer';

import { nftId } from '../../util/nft';

import { ROUTES } from '../../constants/routes';

import { PublicAddressDoublet } from '../../types';

import classes from './styles/ConfirmContainer.module.scss';

const CONTAINER_TYPES = {
  [CONTAINER_NAMES.DELETE]: {
    title: 'Public Address Deletion Complete',
    subtitle: 'Links Deleted',
    errorTitle: 'Public Address Deletion Error',
    actionText: 'Delete Additional Tokens',
    errorBadge: 'deleted',
  },
  [CONTAINER_NAMES.EDIT]: {
    title: 'Public Address Edits Complete',
    subtitle: 'Links Edited',
    errorTitle: 'Public Address Edits Error',
    actionText: 'Edit Additional Tokens',
    errorBadge: 'edited',
  },
  [CONTAINER_NAMES.ADD]: {
    title: 'New Public Address(es) Linked',
    subtitle: 'Linking Information',
    errorTitle: 'New Public Address(es) Link Error',
    actionText: 'Link Additional Tokens',
    errorBadge: 'linked',
  },
};

type Props = {
  containerName: string;
  name: string;
  results: {
    bundleCost: number;
    successed?: PublicAddressDoublet[];
    errored?: PublicAddressDoublet[];
  };
  remaining: number;
  retryAction?: () => void;
  loading: boolean;
};

const renderTokens = (tokens: PublicAddressDoublet[], subtitle: string) => (
  <>
    <h5 className={classes.subtitle}>{subtitle}</h5>
    {tokens.map(token => (
      <TokenBadge
        {...token}
        key={nftId(token.chainCode, token.tokenCode, token.publicAddress)}
      />
    ))}
  </>
);

const ConfirmContainer: React.FC<Props> = props => {
  const {
    containerName,
    name,
    results,
    remaining,
    retryAction,
    loading,
  } = props;

  const hasErrored = results && results.errored && results.errored.length > 0;
  const isPartialErrored = hasErrored && results.successed;

  const { bundleCost } = results;
  const history = useHistory();

  const title =
    isPartialErrored || !hasErrored
      ? CONTAINER_TYPES[containerName].title
      : CONTAINER_TYPES[containerName].errorTitle;

  const submitButtonText = hasErrored ? 'Try Again' : 'Close';

  const errorBadgeTitle = isPartialErrored ? 'Incomplete links' : 'Error';
  const errorBadgeMessageBody = `Some public addresses were not ${CONTAINER_TYPES[containerName].errorBadge} due to an error.`;
  const errorBadgeMessage = isPartialErrored
    ? `${errorBadgeMessageBody}. See below for public addresses which were ${CONTAINER_TYPES[containerName].errorBadge} sucesfully and try again.`
    : errorBadgeMessageBody;

  const onClick = () => {
    if (!hasErrored) return history.push(`${ROUTES.LINK_TOKEN_LIST}/${name}`);
    retryAction();
  };

  const onBack = () => {
    history.goBack();
  };

  return (
    <PseudoModalContainer title={title} onClose={onClick} fullWidth={true}>
      <div className={classes.container}>
        <div className={classes.nameContainer}>
          <FioName name={name} />
        </div>
        {results &&
          results.successed &&
          renderTokens(
            results.successed,
            CONTAINER_TYPES[containerName].subtitle,
          )}
        <InfoBadge
          title={errorBadgeTitle}
          message={errorBadgeMessage}
          type={BADGE_TYPES.ERROR}
          show={hasErrored}
        />
        {hasErrored && renderTokens(results.errored, 'Errored Links')}
        <BundledTransactionBadge bundles={bundleCost} remaining={remaining} />
        <SubmitButton
          onClick={onClick}
          text={submitButtonText}
          withTopMargin={true}
          loading={loading}
        />
        <p className={classes.actionElement} onClick={onBack}>
          {CONTAINER_TYPES[containerName].actionText}
        </p>
      </div>
    </PseudoModalContainer>
  );
};

export default ConfirmContainer;
