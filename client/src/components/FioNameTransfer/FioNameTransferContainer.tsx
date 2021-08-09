import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { Field, InjectedFormProps } from 'redux-form';
import { Button } from 'react-bootstrap';
import debounce from 'lodash/debounce';

import PseudoModalContainer from '../PseudoModalContainer';
import InputRedux, { INPUT_UI_STYLES } from '../Input/InputRedux';
import { BADGE_TYPES } from '../Badge/Badge';
import PriceBadge from '../Badges/PriceBadge/PriceBadge';
import PayWithBadge from '../Badges/PayWithBadge/PayWithBadge';
import LowBalanceBadge from '../Badges/LowBalanceBadge/LowBalanceBadge';
import InfoBadge from '../InfoBadge/InfoBadge';

import { ROUTES } from '../../constants/routes';
import { ContainerProps, TransferParams } from './types';

import classes from './FioNameTransferContainer.module.scss';
import { fioNameLabels } from '../../constants/labels';
import { ERROR_UI_TYPE } from '../Input/ErrorBadge';
import {
  CONFIRM_PIN_ACTIONS,
  MANAGE_PAGE_REDIRECT,
} from '../../constants/common';
import { hasFioAddressDelimiter, waitForEdgeAccountStop } from '../../utils';
import { PinConfirmation } from '../../types';
import Processing from '../common/TransactionProcessing';
import { Redirect } from 'react-router-dom';
import Results from '../common/TransactionResults';
import { TRANSFER_REQUEST } from '../../redux/fio/actions';
import { ResultsData } from '../common/TransactionResults/types';

const PLACEHOLDER = 'Enter FIO Address or FIO Public Key of New Owner';
const FIO_NAME_DATA = {
  address: {
    infoMessage: 'Transferring a FIO Address will purge all linked wallets',
    backLink: ROUTES.FIO_ADDRESSES,
    forwardLink: ROUTES.FIO_ADDRESS_TRANSFER_RESULTS,
  },
  domain: {
    infoMessage:
      'Transferring a FIO Domain will not transfer ownership of FIO Addresses on that Domain',
    backLink: ROUTES.FIO_DOMAINS,
    forwardLink: ROUTES.FIO_DOMAIN_TRANSFER_RESULTS,
  },
};

export const FioNameTransferContainer: React.FC<ContainerProps &
  InjectedFormProps<{}, ContainerProps>> = props => {
  const {
    walletPublicKey,
    currentWallet,
    feePrice,
    history,
    name,
    pageName,
    transferProcessing,
    refreshBalance,
    pinConfirmation,
    transfer,
    result: trxResult,
    getFee,
    getPrices,
    showPinModal,
    resetPinConfirm,
    transferAddressValue,
    asyncValidate,
    valid,
    dirty,
    asyncValidating,
  } = props;

  const { costFio, costUsdc } = feePrice;
  const [formIsValid, setFormIsValid] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  useEffect(() => {
    getPrices();
    getFee(hasFioAddressDelimiter(name));
    refreshBalance(walletPublicKey);
  }, []);

  useEffect(() => {
    setFormIsValid(valid && !asyncValidating && dirty);
  }, [asyncValidating]);

  useEffect(() => {
    setFormIsValid(false);
  }, [transferAddressValue]);

  // Handle pin confirmation
  useEffect(() => {
    submit(pinConfirmation);
  }, [pinConfirmation]);

  // Handle results
  useEffect(() => {
    if (!transferProcessing && processing) {
      resetPinConfirm();

      setResultsData({
        feeCollected: trxResult.feeCollected || feePrice,
        name,
        publicKey:
          trxResult.newOwnerKey ||
          (hasFioAddressDelimiter(transferAddressValue)
            ? ''
            : transferAddressValue),
        error: trxResult.error,
      });
      setProcessing(false);
    }
  }, [transferProcessing, trxResult]);

  const submit = async (pinConfirmation: PinConfirmation) => {
    const {
      account: edgeAccount,
      keys: walletKeys,
      error: confirmationError,
      action: confirmationAction,
    } = pinConfirmation;

    if (confirmationAction !== CONFIRM_PIN_ACTIONS.TRANSFER) return;
    if (
      walletKeys &&
      walletKeys[currentWallet.id] &&
      !confirmationError &&
      !transferProcessing &&
      !processing
    ) {
      setProcessing(true);
      await waitForEdgeAccountStop(edgeAccount);
      const transferParams: TransferParams = {
        fioName: name,
        fee: feePrice.nativeFio,
        keys: walletKeys[currentWallet.id],
        ...(hasFioAddressDelimiter(transferAddressValue)
          ? { newOwnerFioAddress: transferAddressValue }
          : { newOwnerKey: transferAddressValue }),
      };

      transfer(transferParams);
    }

    if (confirmationError) setProcessing(false);
  };

  const debouncedValidate = useCallback(
    debounce(() => {
      asyncValidate();
    }, 500),
    [],
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showPinModal(CONFIRM_PIN_ACTIONS.TRANSFER);
  };

  const onResultsClose = () => {
    history.push(MANAGE_PAGE_REDIRECT[pageName]);
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };

  const fioNameLabel = fioNameLabels[pageName];
  const title = `Transfer FIO ${fioNameLabel} Ownership`;

  const hasLowBalance =
    currentWallet && feePrice && currentWallet.balance < feePrice.costFio;

  if (resultsData)
    return (
      <Results
        results={resultsData}
        title={
          resultsData.error
            ? 'Ownership Transfer Failed!'
            : 'Ownership Transferred!'
        }
        actionName={TRANSFER_REQUEST}
        pageName={pageName}
        onClose={onResultsClose}
        onRetry={onResultsRetry}
      />
    );

  if (!walletPublicKey && !processing)
    return <Redirect to={{ pathname: FIO_NAME_DATA[pageName].backLink }} />;

  return (
    <PseudoModalContainer link={FIO_NAME_DATA[pageName].backLink} title={title}>
      <div className={classes.container}>
        <InfoBadge
          message={FIO_NAME_DATA[pageName].infoMessage}
          title="Important Information"
          type={BADGE_TYPES.INFO}
          show={true}
        />
        <p className={classes.nameContainer}>
          {fioNameLabel}: <span className={classes.name}>{name}</span>
        </p>
        <p className={classes.label}>Transfer Information</p>
        <form onSubmit={handleSubmit} className={classes.form}>
          <Field
            name="transferAddress"
            type="text"
            placeholder={PLACEHOLDER}
            component={InputRedux}
            showCopyButton={true}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            onChange={debouncedValidate}
            errorType={ERROR_UI_TYPE.BADGE}
            loading={asyncValidating}
          />
          <p className={classes.label}>{fioNameLabel} Transfer Cost</p>
          <PriceBadge
            costFio={costFio}
            costUsdc={costUsdc}
            title={`${fioNameLabel} Transfer Fee`}
            type={BADGE_TYPES.BLACK}
          />
          <PayWithBadge
            costFio={costFio}
            costUsdc={costUsdc}
            currentWallet={currentWallet}
          />
          <LowBalanceBadge hasLowBalance={hasLowBalance} />
          <Button
            type="submit"
            className={classes.button}
            disabled={hasLowBalance || !formIsValid || processing}
          >
            Transfer Now
          </Button>
        </form>
        <Processing isProcessing={processing} />
      </div>
    </PseudoModalContainer>
  );
};
