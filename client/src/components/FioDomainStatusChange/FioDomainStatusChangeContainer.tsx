import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import { ROUTES } from '../../constants/routes';
import PseudoModalContainer from '../PseudoModalContainer';
import DomainStatusBadge from '../Badges/DomainStatusBadge/DomainStatusBadge';
import PriceBadge from '../Badges/PriceBadge/PriceBadge';
import PayWithBadge from '../Badges/PayWithBadge/PayWithBadge';
import LowBalanceBadge from '../Badges/LowBalanceBadge/LowBalanceBadge';

import { BADGE_TYPES } from '../Badge/Badge';

import { ContainerProps } from './types';
import { CONFIRM_PIN_ACTIONS, DOMAIN_STATUS } from '../../constants/common';

import classes from './FioDomainStatusChangeContainer.module.scss';
import { waitForEdgeAccountStop } from '../../utils';
import { PinConfirmation } from '../../types';
import { Redirect } from 'react-router';
import Processing from '../common/TransactionProcessing';
import Results from '../common/TransactionResults';
import { SET_VISIBILITY_REQUEST } from '../../redux/fio/actions';
import { ResultsData } from '../common/TransactionResults/types';

const FioDomainStatusChangeContainer: React.FC<ContainerProps> = props => {
  const {
    walletPublicKey,
    currentWallet,
    feePrice,
    history,
    name,
    domainStatus,
    setVisibilityProcessing,
    refreshBalance,
    pinConfirmation,
    setDomainVisibility,
    result,
    getFee,
    getPrices,
    showPinModal,
    resetPinConfirm,
  } = props;
  const statusToChange =
    domainStatus === DOMAIN_STATUS.PRIVATE
      ? DOMAIN_STATUS.PUBLIC
      : DOMAIN_STATUS.PRIVATE;
  const { costFio, costUsdc } = feePrice;
  const [processing, setProcessing] = useState(false);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  useEffect(() => {
    getPrices();
    getFee();
    refreshBalance(walletPublicKey);
  }, []);

  // Handle pin confirmation
  useEffect(() => {
    submit(pinConfirmation);
  }, [pinConfirmation]);

  // Handle results
  useEffect(() => {
    if (!setVisibilityProcessing && processing) {
      resetPinConfirm();

      setResultsData({
        feeCollected: result.feeCollected || feePrice,
        name,
        changedStatus: statusToChange,
        error: result.error,
      });
      setProcessing(false);
    }
  }, [setVisibilityProcessing, result]);

  const submit = async (pinConfirmation: PinConfirmation) => {
    const {
      account: edgeAccount,
      keys: walletKeys,
      error: confirmationError,
      action: confirmationAction,
    } = pinConfirmation;

    if (confirmationAction !== CONFIRM_PIN_ACTIONS.SET_VISIBILITY) return;
    if (
      walletKeys &&
      walletKeys[currentWallet.id] &&
      !confirmationError &&
      !setVisibilityProcessing &&
      !processing
    ) {
      setProcessing(true);
      await waitForEdgeAccountStop(edgeAccount);

      setDomainVisibility({
        fioDomain: name,
        fee: feePrice.nativeFio,
        keys: walletKeys[currentWallet.id],
        isPublic: statusToChange === DOMAIN_STATUS.PUBLIC,
      });
    }

    if (confirmationError) setProcessing(false);
  };

  const handleSubmit = () => {
    showPinModal(CONFIRM_PIN_ACTIONS.SET_VISIBILITY);
  };

  const onResultsClose = () => {
    history.push(ROUTES.FIO_DOMAINS);
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };

  const hasLowBalance =
    currentWallet && feePrice && currentWallet.balance < feePrice.costFio;

  if (resultsData)
    return (
      <Results
        results={resultsData}
        title={
          resultsData.error
            ? 'Domain Status Change Failed!'
            : 'Domain Status Changed!'
        }
        actionName={SET_VISIBILITY_REQUEST}
        onClose={onResultsClose}
        onRetry={onResultsRetry}
      />
    );

  if (!walletPublicKey && !processing)
    return <Redirect to={{ pathname: ROUTES.FIO_DOMAINS }} />;

  return (
    <PseudoModalContainer
      link={ROUTES.FIO_DOMAINS}
      title="Change Domain Status"
    >
      <div className={classes.container}>
        <div className={classes.nameContainer}>
          Domain: <span className={classes.name}>{name}</span>
        </div>
        <div className={classes.statusContainer}>
          <h5 className={classes.label}>Change Status to:</h5>
          <div className={classes.statusBadge}>
            <DomainStatusBadge status={statusToChange} />
          </div>
        </div>
        <h5 className={classes.label}>Change Change Cost</h5>
        <div className={classes.badge}>
          <PriceBadge
            costFio={costFio}
            costUsdc={costUsdc}
            type={BADGE_TYPES.BLACK}
            title="Status Change Fee"
          />
        </div>

        <PayWithBadge
          costFio={costFio}
          costUsdc={costUsdc}
          currentWallet={currentWallet}
        />
        <LowBalanceBadge hasLowBalance={hasLowBalance} />
        <Button
          className={classes.button}
          onClick={handleSubmit}
          disabled={processing || hasLowBalance}
        >
          Change Status
        </Button>
      </div>
      <Processing isProcessing={processing} />
    </PseudoModalContainer>
  );
};

export default FioDomainStatusChangeContainer;
