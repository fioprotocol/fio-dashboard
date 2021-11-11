import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import PseudoModalContainer from '../PseudoModalContainer';
import DomainStatusBadge from '../Badges/DomainStatusBadge/DomainStatusBadge';
import PriceBadge from '../Badges/PriceBadge/PriceBadge';
import PayWithBadge from '../Badges/PayWithBadge/PayWithBadge';
import LowBalanceBadge from '../Badges/LowBalanceBadge/LowBalanceBadge';
import InfoBadge from '../InfoBadge/InfoBadge';
import { BADGE_TYPES } from '../Badge/Badge';
import Processing from '../common/TransactionProcessing';
import SetVisibilityResults from '../common/TransactionResults/components/SetVisibilityResults';

import { waitForEdgeAccountStop } from '../../utils';

import { ROUTES } from '../../constants/routes';
import { CONFIRM_PIN_ACTIONS, DOMAIN_STATUS } from '../../constants/common';

import { ContainerProps } from './types';
import { PinConfirmation } from '../../types';
import { ResultsData } from '../common/TransactionResults/types';

import classes from './FioDomainStatusChangeContainer.module.scss';

const INFO_MESSAGE_TEXT = {
  [DOMAIN_STATUS.PUBLIC]:
    'making your domain public will allow anyone to register a FIO Address on that domain',
  [DOMAIN_STATUS.PRIVATE]:
    'making your domain private will only allow the owner of the domain to register FIO Addresses on it.',
};

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
        changedStatus: domainStatus,
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
      <SetVisibilityResults
        results={resultsData}
        title={
          resultsData.error
            ? 'Domain Status Change Failed!'
            : 'Domain Status Changed!'
        }
        hasAutoWidth={true}
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
        <InfoBadge
          title="Important information"
          show={true}
          message={INFO_MESSAGE_TEXT[statusToChange]}
          type={BADGE_TYPES.INFO}
        />
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
