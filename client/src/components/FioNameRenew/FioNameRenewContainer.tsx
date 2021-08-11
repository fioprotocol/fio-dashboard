import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import { BADGE_TYPES } from '../Badge/Badge';
import PseudoModalContainer from '../PseudoModalContainer';
import InfoBadge from '../InfoBadge/InfoBadge';
import PriceBadge from '../Badges/PriceBadge/PriceBadge';
import PayWithBadge from '../Badges/PayWithBadge/PayWithBadge';
import LowBalanceBadge from '../Badges/LowBalanceBadge/LowBalanceBadge';

import { MANAGE_PAGE_REDIRECT } from '../../constants/common';

import { ContainerProps } from './types';

import classes from './FioNameRenewContainer.module.scss';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { hasFioAddressDelimiter, waitForEdgeAccountStop } from '../../utils';
import { PinConfirmation } from '../../types';
import Processing from '../common/TransactionProcessing';
import { Redirect } from 'react-router-dom';
import Results from '../common/TransactionResults';
import { RENEW_REQUEST } from '../../redux/fio/actions';
import { ResultsData } from '../common/TransactionResults/types';

const FioNameRenewContainer: React.FC<ContainerProps> = props => {
  const {
    walletPublicKey,
    currentWallet,
    feePrice,
    history,
    name,
    pageName,
    renewProcessing,
    refreshBalance,
    pinConfirmation,
    renew,
    result,
    getFee,
    getPrices,
    showPinModal,
    resetPinConfirm,
  } = props;

  const { costFio, costUsdc } = feePrice;
  const [processing, setProcessing] = useState(false);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  useEffect(() => {
    getPrices();
    getFee(hasFioAddressDelimiter(name));
    refreshBalance(walletPublicKey);
  }, []);

  // Handle pin confirmation
  useEffect(() => {
    submit(pinConfirmation);
  }, [pinConfirmation]);

  // Handle results
  useEffect(() => {
    if (!renewProcessing && processing) {
      resetPinConfirm();

      setResultsData({
        feeCollected: result.feeCollected || feePrice,
        name,
        error: result.error,
      });
      setProcessing(false);
    }
  }, [renewProcessing, result]);

  const submit = async (pinConfirmation: PinConfirmation) => {
    const {
      account: edgeAccount,
      keys: walletKeys,
      error: confirmationError,
      action: confirmationAction,
    } = pinConfirmation;

    if (confirmationAction !== CONFIRM_PIN_ACTIONS.RENEW) return;
    if (
      walletKeys &&
      walletKeys[currentWallet.id] &&
      !confirmationError &&
      !renewProcessing &&
      !processing
    ) {
      setProcessing(true);
      await waitForEdgeAccountStop(edgeAccount);
      renew({
        fioName: name,
        fee: feePrice.nativeFio,
        keys: walletKeys[currentWallet.id],
      });
    }

    if (confirmationError) setProcessing(false);
  };

  const hasLowBalance =
    currentWallet && feePrice && currentWallet.balance < feePrice.costFio;

  const handleRenewClick = () => {
    showPinModal(CONFIRM_PIN_ACTIONS.RENEW);
  };

  const onResultsClose = () => {
    history.push(MANAGE_PAGE_REDIRECT[pageName]);
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };

  if (resultsData)
    return (
      <Results
        results={resultsData}
        title={resultsData.error ? 'Renewed Failed!' : 'Renewed!'}
        actionName={RENEW_REQUEST}
        pageName={pageName}
        onClose={onResultsClose}
        onRetry={onResultsRetry}
      />
    );

  if (!walletPublicKey && !processing)
    return <Redirect to={{ pathname: MANAGE_PAGE_REDIRECT[pageName] }} />;

  return (
    <PseudoModalContainer
      title="Renew Now"
      link={MANAGE_PAGE_REDIRECT[pageName]}
    >
      <div className={classes.container}>
        <InfoBadge
          title="Renewal Information"
          message="This renewal will add 365 days to expiration and 100 Bundle Transactions"
          show={true}
          type={BADGE_TYPES.INFO}
        />
        <h5 className={classes.label}>Renew Details</h5>
        <PriceBadge
          costFio={costFio}
          costUsdc={costUsdc}
          title={name}
          type={BADGE_TYPES.WHITE}
        />
        <h5 className={classes.label}>Payment Details</h5>
        <PriceBadge
          costFio={costFio}
          costUsdc={costUsdc}
          title="Total Cost"
          type={BADGE_TYPES.BLACK}
        />
        <PayWithBadge
          costFio={costFio}
          costUsdc={costUsdc}
          currentWallet={currentWallet}
        />
        <LowBalanceBadge hasLowBalance={hasLowBalance} />
        <Button
          onClick={handleRenewClick}
          className={classes.button}
          disabled={hasLowBalance || processing}
        >
          Renew Now
        </Button>
      </div>
      <Processing isProcessing={processing} />
    </PseudoModalContainer>
  );
};

export default FioNameRenewContainer;
