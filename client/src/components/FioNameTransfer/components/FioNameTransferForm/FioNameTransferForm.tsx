import React, { FormEvent, useState } from 'react';

import { Field, FieldValue } from '../../../Input/Field';
import { TransactionDetails } from '../../../TransactionDetails/TransactionDetails';
import PayWithBadge from '../../../Badges/PayWithBadge/PayWithBadge';
import LowBalanceBadge from '../../../Badges/LowBalanceBadge/LowBalanceBadge';
import SubmitButton from '../../../common/SubmitButton/SubmitButton';

import { validate } from './validation';

import { INPUT_UI_STYLES } from '../../../Input/InputRedux';
import { fioNameLabels } from '../../../../constants/labels';
import { ERROR_UI_TYPE } from '../../../Input/ErrorBadge';

import { useWalletBalances } from '../../../../util/hooks';
import MathOp from '../../../../util/math';
import { useCheckIfMobileScreenSize } from '../../../../screenType';

import { FormProps } from '../../types';

import classes from '../../FioNameTransferContainer.module.scss';

export const TransferForm: React.FC<FormProps> = props => {
  const {
    fioNameType,
    name,
    walletName,
    feePrice,
    publicKey,
    onSubmit,
    processing,
  } = props;
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(true);

  const { available: walletBalancesAvailable } = useWalletBalances(publicKey);
  const isMobileScreenSize = useCheckIfMobileScreenSize();

  const fioNameLabel = fioNameLabels[fioNameType];
  const hasLowBalance =
    !!publicKey &&
    feePrice &&
    new MathOp(walletBalancesAvailable.nativeFio || 0).lt(
      feePrice.nativeFio || 0,
    );

  const PLACEHOLDER = !isMobileScreenSize
    ? 'Enter FIO Handle or FIO Public Key of New Owner'
    : `New Owner's FIO Handle or Public Key`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setValidating(true);
      await validate({ transferAddress: value });
    } catch (e) {
      setValidating(false);
      setValid(false);
      return setError(e.message);
    }
    setValidating(false);
    onSubmit(value);
  };

  const onChange = async (newValue: FieldValue) => {
    setValue(`${newValue.toString()}`);
    if (error) {
      setError(null);
      setValid(true);
    }
  };

  return (
    <>
      <p className={classes.nameContainer}>
        {fioNameLabel}: <span className={classes.name}>{name}</span>
      </p>
      <p className={classes.label}>Transfer Information</p>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Field
          name="transferAddress"
          value={value}
          onChange={onChange}
          placeholder={PLACEHOLDER}
          error={error}
          lowerCased={false}
          type="text"
          showPasteButton={true}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          errorType={ERROR_UI_TYPE.BADGE}
          loading={validating}
        />
        <p className={classes.label}>{fioNameLabel} Transaction Details</p>
        <TransactionDetails feeInFio={feePrice.nativeFio} />
        <PayWithBadge
          walletBalances={walletBalancesAvailable}
          walletName={walletName}
        />
        <LowBalanceBadge hasLowBalance={hasLowBalance} />
        <SubmitButton
          text="Transfer Now"
          disabled={
            hasLowBalance || !valid || processing || !value || validating
          }
          withTopMargin={true}
        />
      </form>
    </>
  );
};
