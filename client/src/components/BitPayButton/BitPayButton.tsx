import React from 'react';

import SubmitButton from '../common/SubmitButton/SubmitButton';

import bitPayLogoSrc from '../../assets/images/bitpay-logo-white.png';
import bitPayCurrenciesSrc from '../../assets/images/bp-btn-pay-currencies.svg';

import { ClickEventTypes } from '../../types';

import classes from './BitPayButton.module.scss';

type Props = {
  onClick: (event: ClickEventTypes) => Promise<void>;
  hasLowHeight?: boolean;
  bitPayButtonSize?: keyof typeof BITPAY_LOGO_WIDTH;
  loading: boolean;
  disabled: boolean;
};

type ButtonTextProps = {
  width: string;
};

export const BITPAY_LOGO_WIDTH = {
  default: '86px',
  hasLowHeight: '65px',
  currencies: '120px',
} as const;

export const BitPayButtonText: React.FC<ButtonTextProps> = props => {
  const { width } = props;
  return (
    <div className="d-flex justify-content-center align-items-center">
      <span className={classes.regularText}>Pay with</span>
      <div>
        <img
          src={bitPayLogoSrc}
          alt="Pay With BitPay"
          className=""
          width={width}
        />
      </div>
    </div>
  );
};
export const BitPayCurrencies: React.FC<ButtonTextProps> = props => {
  const { width } = props;
  return (
    <img
      src={bitPayCurrenciesSrc}
      alt="Currencies"
      className=""
      width={width}
    />
  );
};

export const BitPayButton: React.FC<Props> = props => {
  const buttonTextDimensions =
    BITPAY_LOGO_WIDTH[props.bitPayButtonSize] || BITPAY_LOGO_WIDTH.default;

  return (
    <div>
      <SubmitButton
        {...props}
        text={<BitPayButtonText width={buttonTextDimensions} />}
        isCobalt
      />
      <div className="flex-1 d-flex justify-content-center align-items-center mt-2">
        <BitPayCurrencies width={BITPAY_LOGO_WIDTH.currencies} />
      </div>
    </div>
  );
};
